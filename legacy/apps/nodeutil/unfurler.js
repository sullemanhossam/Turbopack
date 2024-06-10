const logger = require('./util/logger');

//const { unfurl } = require('unfurl.js');
import {unfurl} from 'unfurl.js';



class Unfurler {
    /**
     * Initialize the Kafka consumer to listen for request and push to server
     * @param theSocketServer
     */

        normalize(result) {
            //logger.info(result);

            let unfurled = {};
            if (result['title'] !== undefined)
                unfurled['title'] = result['title'];
            if (result['description'] !== undefined)
                unfurled['description'] = result['description'];
            if (result['favicon'] !== undefined)
                unfurled['favicon'] = result['favicon'];

            // ... We are selecting these by priority
            if (result['twitter_card'] !== undefined)
            {

                if (result['twitter_card']['title'] !== undefined)
                    unfurled['title'] = result['twitter_card']['title'];

                if (result['twitter_card']['description'] !== undefined)
                    unfurled['description'] = result['twitter_card']['description'];
            }
            else if (result['oEmbed'] !== undefined)
            {
                if (result['oEmbed']['title'] !== undefined)
                    unfurled['title'] = result['oEmbed']['title'];

            }
            else if (result['open_graph'] !== undefined)
            {
                if (result['open_graph']['title'] !== undefined)
                    unfurled['title'] = result['open_graph']['title'];

                if (result['open_graph']['description'] !== undefined)
                    unfurled['description'] = result['open_graph']['description'];
            }


            if (result['twitter_card'] != undefined && result['twitter_card']['images'] !== undefined) {
                unfurled['images'] = [result['twitter_card']['images']];
            }

            if (result['oEmbed'] != undefined && result['oEmbed']['images'] !== undefined) {
                unfurled['images'] = [result['oEmbed']['images']];
            }

            if (result['open_graph'] != undefined && result['open_graph']['images'] !== undefined) {
                unfurled['images'] = [result['open_graph']['images']];
            }

            return unfurled;
        }

        unfurledImageLink(url) {
            logger.info("Direct unfurl of : " + url);

            let result = {};

            let urlObj = new URL(url);
            // Create a dummy twitter card
            result['favicon'] = urlObj.protocol + "//" + urlObj.hostname + "/favicon.ico";
            result['twitter_card'] = ['images'];
            result['twitter_card']['images'] = [{'url':url}];

            return result;
        }

        async processUnfurlCommand(dataObj) {
            try {
                logger.info("Unfurling: " + dataObj.payload.url);

                let result = [];
                // If the url is just a link, we can jst construct a response and send
                if (dataObj.payload.url.endsWith('.jpg') ||
                    dataObj.payload.url.endsWith('.png') ||
                    dataObj.payload.url.endsWith('.gif')) {
                    result = this.unfurledImageLink(dataObj.payload.url);
                }
                else {
                    // Perform actual unfurling
                    result = await unfurl(dataObj.payload.url, {follow: 1, timeout: 10000});
                }

                return this.normalize(result);
            }
            catch(err) {
                    // Nothing to do. Just ignore.
                    logger.error(err);
                    return;
            }
        }

}


module.exports = Unfurler;