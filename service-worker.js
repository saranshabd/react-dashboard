if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"76bbfc2bebe8c45b003ea90bba24e567","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"b6be275452186e3ad7897e689d9a138f","url":"static/css/26.f5f9d973.chunk.css"},{"revision":"b9a0172d2b3ffda96cf7157327aab4d6","url":"static/css/27.4e97b452.chunk.css"},{"revision":"c0e7b7056e7491d5fc249568cb6166fb","url":"static/js/0.4c4cccd3.chunk.js"},{"revision":"0ac41ab3c2c20160553f4f5b619d2156","url":"static/js/1.c1b74334.chunk.js"},{"revision":"a0472fca2438b7ff8abf27810fd98569","url":"static/js/10.7f34f0eb.chunk.js"},{"revision":"8194ec392f5fa6fc4e80c4d5b4d1872d","url":"static/js/11.24c34193.chunk.js"},{"revision":"cb63debea1d0737169892fd57e78f2e8","url":"static/js/12.af79a87a.chunk.js"},{"revision":"43b08c435669f84d636e573deb352547","url":"static/js/13.077b8bca.chunk.js"},{"revision":"1b340058387ec8c439082fee12d9c27c","url":"static/js/16.c58fd372.chunk.js"},{"revision":"020ce3b64d5b6c783b26256557e15f05","url":"static/js/17.5857423b.chunk.js"},{"revision":"8ed21b9bc03a7b19112747671c847a7b","url":"static/js/18.d4fc3535.chunk.js"},{"revision":"a49c22314a2ce935b1341629a20ba6f6","url":"static/js/19.c56cabc0.chunk.js"},{"revision":"2b815b16ac3473ce3b5dca4584213cfc","url":"static/js/2.b308477f.chunk.js"},{"revision":"5029fe1cc5b4167828456e59a37a481c","url":"static/js/20.74ef08fa.chunk.js"},{"revision":"094fe04bbfb75b8032d1fe91c5189190","url":"static/js/21.275b037e.chunk.js"},{"revision":"0becfd2810ff71365569fcb5893bb6c8","url":"static/js/22.72dbb4ba.chunk.js"},{"revision":"1993a36448913ca7b331ee64e58d5b0a","url":"static/js/23.3c3d9305.chunk.js"},{"revision":"0848093aea92714049709c3f374f1e66","url":"static/js/24.aef84016.chunk.js"},{"revision":"d6785e19fbe0b991f4bde472cb901b0f","url":"static/js/25.128bc6c9.chunk.js"},{"revision":"187685549efccdb8dcd6e2474bd66b5f","url":"static/js/26.9d9fdb77.chunk.js"},{"revision":"e773d2f67d6edb3dc57249d703b232f7","url":"static/js/27.3b4549b9.chunk.js"},{"revision":"1c7a8d8923a9366876f9cae5fb3f5cf6","url":"static/js/28.97f0ffa2.chunk.js"},{"revision":"49a838b92b639d1ab4d8487fc9a23c6b","url":"static/js/29.ba15bf3f.chunk.js"},{"revision":"87137782e1781e841d54a381b44ef325","url":"static/js/3.9c80e0ae.chunk.js"},{"revision":"f672381e2ec95f249bf2f24592108a2d","url":"static/js/30.7db286e0.chunk.js"},{"revision":"99cc74724ba12f01dbbac3c8c2628739","url":"static/js/31.788d5637.chunk.js"},{"revision":"6c6fc0c5aeac0af915aa695e26816792","url":"static/js/32.42052270.chunk.js"},{"revision":"021db4a3db0f5cf6e8e3a6ff02f55817","url":"static/js/33.86ccae32.chunk.js"},{"revision":"05702e4f618fed7c28cce193dfe595e0","url":"static/js/34.eec627bc.chunk.js"},{"revision":"c68dc52423283d8640fdff609cfc8aa3","url":"static/js/35.4489e81b.chunk.js"},{"revision":"5895a4e3ee57a9edb445986d2feddbd4","url":"static/js/36.7049b10d.chunk.js"},{"revision":"0ddf995168404fcd14af43d26f5006f9","url":"static/js/37.bd270fd4.chunk.js"},{"revision":"51592c9b5d1d6cfcb46486965c235a1c","url":"static/js/38.2c340201.chunk.js"},{"revision":"0f66d5b550755ad997bb28a60a1da823","url":"static/js/39.4236dd0e.chunk.js"},{"revision":"98e22ed619beaa9641af08c21b9ef4df","url":"static/js/4.884f3bb3.chunk.js"},{"revision":"35bc92fb53ae70bdc6ad9d9df60ee686","url":"static/js/40.0fcfb9e5.chunk.js"},{"revision":"8d9f22bc1df887e6057f8358346965f6","url":"static/js/41.69430621.chunk.js"},{"revision":"26af829d437117ece8fabbf2e14fed49","url":"static/js/42.787b5162.chunk.js"},{"revision":"5fa88c4d9b546e1baea95e1d29978fe6","url":"static/js/43.54ff31f5.chunk.js"},{"revision":"7020f10a3ef048ce0a7e98f76352e13b","url":"static/js/44.0937b2c9.chunk.js"},{"revision":"67c7d53ea27432aacbc71235a145769b","url":"static/js/45.92306794.chunk.js"},{"revision":"4e4f6cb8295528cbb2ce7c149a4335c5","url":"static/js/46.2fccfb54.chunk.js"},{"revision":"01ab6faa6af0fc136a77cdcb5015a973","url":"static/js/47.0895b711.chunk.js"},{"revision":"74ae0086b4c84486c869a05d85bb6107","url":"static/js/48.7e7bc2a3.chunk.js"},{"revision":"27923b4eb3bf21870b9cb834c87d87e7","url":"static/js/49.1099eff7.chunk.js"},{"revision":"263840a1341efe64dc987e049f33a0eb","url":"static/js/5.055cf0f1.chunk.js"},{"revision":"adec55659f80583d986b64718764915c","url":"static/js/50.20ffc6bc.chunk.js"},{"revision":"edcd80f7195d5c56cdf8a35125edb569","url":"static/js/51.515cccaa.chunk.js"},{"revision":"b450257a20333471b75268834edfbfd6","url":"static/js/6.dc534ef3.chunk.js"},{"revision":"2a8ac73e9d9d0425a457e5e5bbc0853b","url":"static/js/7.aa7737c5.chunk.js"},{"revision":"0bffd94a1a7c301c16cc88f7d4a94452","url":"static/js/8.0e09d371.chunk.js"},{"revision":"1c0ad12085c5f57e9d9fb8db901e850f","url":"static/js/9.7f50241c.chunk.js"},{"revision":"1b5289b33d51168f4264f995f1d35c96","url":"static/js/main.37c7284e.chunk.js"},{"revision":"88ca68a03722d408308642853c51fca7","url":"static/js/runtime-main.83ecb4f7.js"}]);

    /* custom cache rules */
    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: 'PRODUCTION',
        })
      )
    );

    // Adding staleWhileRevalidate for all js files. Provide faster access from cache while revalidating in the background
    workbox.routing.registerRoute(
      /.*\.js$/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all html files
    workbox.routing.registerRoute(
      /.*\.html/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all css files
    workbox.routing.registerRoute(
      /.*\.css/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding networkFirst for all json data. In offline mode will be fetched from cache
    workbox.routing.registerRoute(
      new RegExp('https://data\\.covid19india\\.org/.*\\.json'),
      new workbox.strategies.NetworkFirst(),
      'GET'
    );
  } else {
    console.log('Workbox could not be loaded. Hence, no offline support.');
  }
}
