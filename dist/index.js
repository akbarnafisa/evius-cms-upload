'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tus = require("tus-js-client");

var cmsUpload = function () {
  function cmsUpload(projectId, writeKey) {
    (0, _classCallCheck3.default)(this, cmsUpload);

    this.projectId = projectId;
    this.writeKey = writeKey;
  }

  (0, _createClass3.default)(cmsUpload, [{
    key: 'upload',
    value: function upload(file) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        var upload = new tus.Upload(file, {
          endpoint: 'https://' + _this.projectId + '.evius.id/media/upload',
          resume: true,
          chunkSize: Infinity,
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type
          },
          removeFingerprintOnSuccess: true,
          headers: {
            authorization: _this.writeKey
          },
          onError: function onError(err) {
            if (err.originalRequest) {
              if (window.confirm('Failed because: ' + err + '\nDo you want to retry?')) {
                upload.start();
              }
            } else {
              window.alert('Failed because: ' + err);
              reject(err);
            }
          },
          onProgress: function onProgress(bytesUploaded, bytesTotal) {},
          onSuccess: function onSuccess() {
            var url = upload.url.split('/upload');
            var extension = upload.file.type.includes('image') ? upload.file.type.split('/')[1] : upload.file.type;
            resolve(url[0] + url[1] + '/' + extension);
          }
        });
        upload.start();
      });
    }
  }]);
  return cmsUpload;
}();

exports.default = cmsUpload;

