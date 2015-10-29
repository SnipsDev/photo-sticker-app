'use strict';
(function(PHOTOAPP){
  var stickers = {};
  var photos = {};
  var currentPhotoId = 0;
  var currentLibStickerId = 0;
  var currentStickersOnPhoto = 0;

  PHOTOAPP.photoAdded = false;
  PHOTOAPP.currentDraggedImage = null;
  PHOTOAPP.getCurrentPhotoId = function() {
    return currentPhotoId;
  };
  PHOTOAPP.getCurrentLibStickerId = function() {
    return currentLibStickerId;
  };
  PHOTOAPP.getCurrentStickersOnPhoto = function() {
    return currentStickersOnPhoto;
  }

  PHOTOAPP.isFileAnImage = function(fileObj) {
    var imageType = false,
        matchString = /^image\//;
    if(fileObj && matchString.test(fileObj.type)) {
      imageType = true; 
    }
    return imageType;
  }
  PHOTOAPP.filesToImgElem = function(fileObj, img) {
    var reader;
    if(fileObj) {
      reader = new FileReader();
      reader.readAsDataURL(fileObj);

      //img.src = window.URL.createObjectURL(fileObj);
      //img.onload = function() {
      //  window.URL.revokeObjectURL(this.src);
      //}
    }
    return reader;
  }
  PHOTOAPP.isLocalStorageSpaceAvailable = function(value) {
    var available = true,
        bytes = 1024 * 1024 * 5,
        str = '';
    value = value || '';
    bytes = 1024 * 1024 * 5;
    str = unescape(encodeURIComponent(JSON.stringify(localStorage)) + JSON.stringify(value));
    if(bytes - str.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  PHOTOAPP.saveItem = function(key, value) {
    if(localStorage && PHOTOAPP.isLocalStorageSpaceAvailable(value)) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } else {
      return false;
    }
  }
  PHOTOAPP.getSavedItem = function(key) {
    if(localStorage && localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    }
  }
  PHOTOAPP.addLibSticker = function(srcString, name) {
    var id = currentLibStickerId;
    if(!stickers[id]) {
      stickers[id] = {};
      stickers[id].srcString = srcString;
      stickers[id].name = name;
      if(PHOTOAPP.saveItem('stickersLib', stickers) && PHOTOAPP.saveItem('stickersLibId', ++currentLibStickerId)) {
        return stickers[id];
      }
    }
    return false;
  }
  PHOTOAPP.deleteLibSticker = function(id) {
    id = id.toString();
    if(stickers[id]) {
      stickers[id] = undefined;
      if(PHOTOAPP.saveItem('stickersLib', stickers)) {
        return true;
      }
    }
    return false;
  }
  PHOTOAPP.updateLibSticker = function(id, srcString) {
    id = id.toString();
    if(stickers[id] && srcString) {
      stickers[id].srcString = srcString;
      if(PHOTOAPP.saveItem('stickersLib', stickers)) {
        return stickers[id];
      }
    }
    return false;
  }
  PHOTOAPP.getLibSticker = function(id) {
    return stickers[id.toString()];
  }
  PHOTOAPP.getAllLibStickers = function() {
    return stickers;
  }
  PHOTOAPP.addPhoto = function(srcString) {
    var id = currentPhotoId;
    if(!photos[id]) {
      photos[id] = {};
      photos[id].srcString = srcString;
      photos[id].stickers = [];
      if(PHOTOAPP.saveItem('photos', photos) && PHOTOAPP.saveItem('photoId', ++currentPhotoId)) {
        return photos[id];
      } 
    }
    return false;
  }
  PHOTOAPP.deletePhoto = function(id) {
    id = id.toString();
    if(photos[id]) {
      photos[id] = undefined;

      if(PHOTOAPP.saveItem('photos', photos)) {
        return true;
      }
    }
    return false;
  }
  PHOTOAPP.updatePhoto = function(id, srcString) {
    id = id.toString();
    if(photos[id] && srcString) {
      photos[id].srcString = srcString;
      if(PHOTOAPP.saveItem('photos', photos)) {
        return photos[id];
      }
    }
    return false;
  }
  PHOTOAPP.getPhoto = function(id) {
    return photos[id.toString()];
  }
  PHOTOAPP.getAllPhotos = function() {
    return photos;
  }
  PHOTOAPP.addStickerToPhoto = function(photoId, stickerString, left, top) {
    if(photos[photoId.toString()]) {
      var stickerObj = {};
      stickerObj.stickerId = currentStickersOnPhoto.toString();
      stickerObj.srcString = stickerString;
      stickerObj.left = left;
      stickerObj.top = top;
      photos[photoId].stickers.push(stickerObj);
      if(PHOTOAPP.saveItem('photos', photos) && PHOTOAPP.saveItem('stickersOnPhotoId', ++currentStickersOnPhoto)) {
        return photos[photoId];
      }
    }
    return false;
  }
  PHOTOAPP.updateStickerInPhoto = function(photoId, stickerId, stickerString, left, top) {
    photoId = photoId.toString();
    stickerId = stickerId.toString();
    if(photos[photoId] && photos[photoId].stickers.length) {
      var stickerArray = photos[photoId].stickers;
      for(var i = 0; i < stickerArray.length; i++) {
        if(stickerArray[i].stickerId === stickerId) {
          if(stickerString)
            stickerArray[i].srcString = stickerString;
          if(left)
            stickerArray[i].left = left;
          if(top)
            stickerArray[i].top = top;
          if(PHOTOAPP.saveItem('photos', photos)) {
            return photos[photoId];
          }
        }
      }
    }
    return false;
  }
  PHOTOAPP.init = function() {
    var initLib = PHOTOAPP.getSavedItem('stickersLib');
    var initPhotos = PHOTOAPP.getSavedItem('photos');
    var photoCount = PHOTOAPP.getSavedItem('photoId'),
        libStickerCount = PHOTOAPP.getSavedItem('stickersLibId'),
        stickersOnPhotoCount = PHOTOAPP.getSavedItem('stickersOnPhotoId');
    if(initLib) {
      stickers = initLib;
    }
    if(initPhotos) {
      photos = initPhotos;
    }
    if(photoCount) {
      currentPhotoId = photoCount;
    }
    if(libStickerCount) {
      currentLibStickerId = libStickerCount;
    }
    if(stickersOnPhotoCount) {
      currentStickersOnPhoto = stickersOnPhotoCount;
    }
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
