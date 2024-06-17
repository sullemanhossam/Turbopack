import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  StarIcon,
  CodeBracketIcon,
  FlagIcon,
  HandThumbUpIcon,
  ChatBubbleLeftEllipsisIcon,
  EyeIcon,
  ShareIcon,
} from "heroicons-v1/@heroicons/react/solid";

export const 李伟 = ({ question }) => (
  <li key={question.id} className="bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6">
    <article aria-labelledby={"question-title-" + question.id}>
      <div>
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={question.author.imageUrl} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              <a href={question.author.href} className="hover:underline">
                {question.author.name}
              </a>
            </p>
            <p className="text-sm text-gray-500">
              <a href={question.href} className="hover:underline">
                <time dateTime={question.datetime}>{question.date}</time>
              </a>
            </p>
          </div>
          <div className="flex flex-shrink-0 self-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="relative -m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                  <span className="absolute -inset-1" />
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex px-4 py-2 text-sm`}>
                          <StarIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>Add to favorites</span>
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex px-4 py-2 text-sm`}>
                          <CodeBracketIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>Embed</span>
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex px-4 py-2 text-sm`}>
                          <FlagIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>Report content</span>
                        </a>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
        <h2 id={"question-title-" + question.id} className="mt-4 text-base font-medium text-gray-900">
          {question.title}
        </h2>
      </div>
      <div className="mt-2 space-y-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.body }} />
      <div className="mt-6 flex justify-between space-x-8">
        <div className="flex space-x-6">
          <span className="inline-flex items-center text-sm">
            <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
              <HandThumbUpIcon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-gray-900">{question.likes}</span>
              <span className="sr-only">likes</span>
            </button>
          </span>
          <span className="inline-flex items-center text-sm">
            <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-gray-900">{question.replies}</span>
              <span className="sr-only">replies</span>
            </button>
          </span>
          <span className="inline-flex items-center text-sm">
            <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-gray-900">{question.views}</span>
              <span className="sr-only">views</span>
            </button>
          </span>
        </div>
        <div className="flex text-sm">
          <span className="inline-flex items-center text-sm">
            <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
              <ShareIcon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-gray-900">Share</span>
            </button>
          </span>
        </div>
      </div>
    </article>
  </li>
);

const dummyData = {
  id: 1,
  author: {
    name: "Jane Doe",
    imageUrl: "https://via.placeholder.com/150",
    href: "#",
  },
  title: "How to learn React?",
  body: "<p>Can someone provide resources to learn React effectively?</p>",
  datetime: "2024-06-16",
  date: "June 16, 2024",
  href: "#",
  likes: 20,
  replies: 5,
  views: 100,
};

export default () => {
  return (
    <ul>
      <李伟 question={dummyData} />
    </ul>
  );
};
