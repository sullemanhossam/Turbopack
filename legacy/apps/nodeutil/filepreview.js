const logger = require('./util/logger');
const unoconv = require('unoconv-promise');
unoconv.listen();

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const url = require('url');
const FormData = require('form-data');
const config = require('config');
import ThumbnailGenerator from 'video-thumbnail-generator';
const ffmpeg = require('fluent-ffmpeg');

const { createReadStream } = require('fs');

const admin_password = config.get('app_admin_password');
//logger.info("Using admin password = " + admin_password);


class FilePreview {
    constructor() {
        this.tempDir = './tmp/';
        this.fcurlbase = '';
        this.fcpath = '';
        this.fcurl = '';
        this.fileName = '';
        this.callBack = '';
        this.authToken = '';
    }

    supportFormats() {
        unoconv
            .formats()
            .then(formats => {
                // formats will be an array contains supports formats
                formats.forEach(format => {
                    console.log(format['format']);
                });
            })
            .catch(e => {
                throw e;
            });
    }


    /**
     * Main entry point method, called by kafka consumer to begin conversion
     * process
     * @param furl : The URL to use to get to the file
     * @param fName : Name of the file
     * @param onSuccess : Callback method once this is all done
     * @returns {Promise<void>}
     */
    async generatePreview(furl,fName, onSuccess) {
        this.fcurl = furl;
        this.callBack = onSuccess;
        this.fileName = fName;
        let myURL = new URL(this.fcurl);
        this.fcpath = myURL.searchParams.get('fspath');
        this.fcurlbase = myURL.protocol+"//"+myURL.host;

        await this.doAdminLogin();
    }

    /**
     * Login using services admin credentials to get to files
     *
     * @returns {Promise<void>}
     */
    async  doAdminLogin() {
        let url = this.fcurlbase + "/api/v1/admin.login";
        let body = 'email=admin@airsend.io&password='+admin_password;
        //logger.info(url + " " + body);
        fetch(url, { method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
            .then(res => res.json()) // expecting a json response
            .then((json) => {
                    //logger.info(JSON.stringify(json));
                    this.authToken = json.token;
                    this.download();
                }
            );
    }


    /**
     * Downloads file to begin conversion. Auth should be ready at this point
     * @returns {Promise<void>}
     */
    async download() {

        if (this.authToken == '') {
            logger.error(" Auth failed. Not proceeding");
        }
        //logger.info(authToken);
        this.fcurl = this.fcurl + "&token="+this.authToken;
        fetch(this.fcurl)

            .then(res => {
                logger.info("Download Call Status  = " + res.status);
                if (res.status == 200) {
                    if (!fs.existsSync(this.tempDir)) {
                        fs.mkdirSync(this.tempDir);
                    }

                    const storePath = path.normalize(this.tempDir + this.fileName);
                    //logger.info(fcurl + " ===> [" + storePath + "]");

                    const dest = fs.createWriteStream(storePath);

                    res.body.pipe(dest);
                    // the finish event is emitted when all data has been flushed from the stream

                    dest.on('finish', () => {
                        logger.info('Completed file download. Starting thumb creation');
                        dest.close();
                        this.createThumb(storePath, this.fileName);
                    });
                }
                else {
                    logger.error("Failed downloading" );
                }
            });

    }

    /**
     * Document file to jpg file conversion using uconv library and reupload back to airsend
     *
     * @param filePath
     * @param fileName
     * @returns {Promise<void>}
     */
    async createThumb(filePath, fileName) {
        let ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
        logger.info("Creating thumb for " + fileName);
        if (this.isVideo(ext)) {
             //this.extractThumb(filePath);
            this.processVideo(filePath);
        }
        else {
            let rc = false;

            let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


            this.convPdf = path.normalize(this.tempDir + 'thumb_' + rand + '.pdf');
            this.convJpg = path.normalize(this.tempDir + 'thumb_' + rand + '.jpg');

            if (ext != 'pdf') {

                rc = await this.convertToPdf(filePath);
                if (!rc) {
                    logger.error("Failed pdf conversion of " + filePath);
                    this.callBack(false);
                    return;
                }
                logger.info("Deleting " + filePath);
                fs.unlinkSync(filePath);

            } else {
                this.convPdf = filePath;
            }
            rc = await this.convertToJpg(this.convPdf);
            if (!rc) {
                logger.error("Failed Jpg conversion of " + this.convPdf);
                this.callBack(false);
                return;
            }
            fs.unlinkSync(this.convPdf);

            // Upload the file now
            await this.uploadSideCar(this.convJpg);
        }

    }

    async convertToPdf(filePath) {
        logger.info("Converting [" + filePath + "] ===> [" + this.convPdf + "]");


        try {
            await unoconv
                .run({
                    file: filePath,
                    output: this.convPdf
                })
        } catch (e) {
            logger.error(e);
            return false;
        }
        return true;
    }

    async convertToJpg(filePath) {
        logger.info("Converting [" + filePath + "] ===> [" + this.convJpg + "]");

        try {
            await unoconv
                .run({
                    file: filePath,
                    output: this.convJpg
                })
        } catch (e) {
            logger.error(e);
            return false;
        }
        return true;
    }


    async uploadSideCar(convPng) {
        let uploadUrl =this.fcurlbase + '/api/v1/internal/file.sidecarupload?fspath='+this.fcpath;
        logger.info("Uploading " + uploadUrl);

        const stream = createReadStream(convPng);
        const form = new FormData();
        form.append('file', stream);

        uploadUrl = uploadUrl + "&token="+this.authToken;

        fetch( uploadUrl,
            { method: 'POST',
                body: form })
            .then(res => res.json())
            .then((json) => {
                logger.info(JSON.stringify(json));
                // Clean up. Delete the temp files in tmp folder.
                logger.info("Deleting " + convPng);
                fs.unlinkSync(convPng);
                // Call back to indicate success
                this.callBack(true);
            });
    }

    isVideo(ext) {

        return  (ext == 'mp4' || ext == 'mov' || ext == 'avi')
    }


    processVideo(filePath) {
        ffmpeg(filePath).ffprobe((error, videoInfo) => {
            if (error) {
                logger.error(" Error: " + error);
                return;
            }
            let { duration, size } = videoInfo.format;
            logger.info("Duration = " + duration);

            // Snip 5 second video
            if (duration >  4) {
                duration = 4;
            }

            // Snip the video
            this.snipVideo(filePath, duration);
        });
    }


    snipVideo(filePath, fragmentDurationInSeconds) {

        let ext = filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase();

        let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        let outputPath  = './tmp/snipped_' + rand + '.' + ext;

        ffmpeg(filePath).inputOptions('-ss 0')
            .outputOptions([`-t ${fragmentDurationInSeconds}`])
            .noAudio()
            .output(outputPath)
            .on('end', () => {
                logger.info('Snipped video');
                fs.unlinkSync(filePath);
                this.extractThumb(outputPath);
            })
            .on('error', (error) => {
                logger.error('Error: ' + error);
                fs.unlinkSync(filePath);
            })
            .run();

    }

    extractThumb(filePath) {

        let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        let outName  = 'thumb_' + rand + '.gif';

        let tg = new ThumbnailGenerator({
            sourcePath:filePath,
            thumbnailPath: './tmp/',
            logger: logger
        });
        tg.generateGifCb({scale: 320, fps: 16,speedMultiplier: 1, fileName: outName}, (err, result) => {
            logger.info("Deleting " + filePath);

            fs.unlinkSync(filePath);
            if (err) {
                logger.info("Error: " + err);
            }
            logger.info("Thumb generation complete");
            // Upload the file now
            this.uploadSideCar("./tmp/" + outName);
        });

    }
}


module.exports = FilePreview;