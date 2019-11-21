import { Driver } from './driver';
import { SimpleNet } from './simple-net';
import { Framework } from '@vechain/connex-framework'
const { getMetadata } = require('page-metadata-parser');
// set connex
let simpleNet = new SimpleNet()
let initialHead = prompt('flutter_webview') as string;
let driver = new Driver(simpleNet, window.genesis, JSON.parse(initialHead));
Object.defineProperty(window, 'connex', { value: new Framework(driver), enumerable: true });
delete window.genesis;

//get meta
Object.defineProperty(window, '__getMetaData__', {
    value: function () {
        return getMetadata(document, document.URL)
    }
});

//night mode 
Object.defineProperty(window, "__NightMode__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: { enabled: false }
});

const NIGHT_MODE_INVERT_FILTER_CSS = "brightness(80%) invert(100%) hue-rotate(180deg)";

const NIGHT_MODE_STYLESHEET =
    `html {
   -webkit-filter: hue-rotate(180deg) invert(100%) !important;
 }
 iframe,img,video {
   -webkit-filter: ${NIGHT_MODE_INVERT_FILTER_CSS} !important;
 }`;

let styleElement: any;

function getStyleElement() {
    if (styleElement) {
        return styleElement;
    }

    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(NIGHT_MODE_STYLESHEET));

    return styleElement;
}

function applyInvertFilterToChildBackgroundImageElements(parentNode: any) {
    parentNode.querySelectorAll("[style*=\"background\"]").forEach(function (el: any) {
        if ((el.style.backgroundImage || "").startsWith("url")) {
            applyInvertFilterToElement(el);
        }
    });
}

function applyInvertFilterToElement(el: any) {
    invertedBackgroundImageElements.push(el);
    el.__NightMode_originalFilter = el.style.webkitFilter;
    el.style.webkitFilter = NIGHT_MODE_INVERT_FILTER_CSS;
}

function removeInvertFilterFromElement(el: any) {
    el.style.webkitFilter = el.__NightMode_originalFilter;
    delete el.__NightMode_originalFilter;
}

let invertedBackgroundImageElements: any = null;

let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                applyInvertFilterToChildBackgroundImageElements(node);
            }
        });
    });
});

Object.defineProperty(window.__NightMode__, "setEnabled", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (enabled: boolean) {
        if (enabled === window.__NightMode__.enabled) {
            return;
        }

        window.__NightMode__.enabled = enabled;

        let styleElement = getStyleElement();

        if (enabled) {
            invertedBackgroundImageElements = [];

            // Apply the NightMode CSS to the document.
            document.documentElement.appendChild(styleElement);

            // Add the "invert" CSS class name to all elements with a
            // `background-image` in their `style` property/attribute.
            applyInvertFilterToChildBackgroundImageElements(document);

            // Observe for future elements in the document containing
            // `background-image` in their `style` property/attribute
            // so that we can also apply the "invert" CSS class name
            // to them as they are added.
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            return;
        }

        // Stop observing for future elements in the document.
        observer.disconnect();

        // Remove the "invert" CSS class name from all elements
        // it was previously applied to.
        invertedBackgroundImageElements.forEach(removeInvertFilterFromElement);

        // Remove the NightMode CSS from the document.
        let styleElementParentNode = styleElement.parentNode;
        if (styleElementParentNode) {
            styleElementParentNode.removeChild(styleElement);
        }

        invertedBackgroundImageElements = null;

        // Workaround for Bug 1424243 where turning Night Mode *off*
        // in some cases has no effect on the background color for
        // web pages that do not specify a background color.
        let computedBackgroundColor = (getComputedStyle(document.documentElement) as any)['background-color'];
        if (computedBackgroundColor === "rgba(0, 0, 0, 0)") {
            document.documentElement.style.backgroundColor = "#fff";
        }
    }
});

window.addEventListener("DOMContentLoaded", function () {
    window.__NightMode__.setEnabled(window.__NightMode__.enabled);
});

declare global {
    interface Window {
        baseURL: string
        genesis: Connex.Thor.Block
        initialHead: Connex.Thor.Status['head']
        __NightMode__: any

    }
}
