var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from "axios";
import * as fs from "fs";
var MAX_WIDTH = 240;
var MAX_HEIGHT = 240;
export var getThumbnailImage = function (_a) {
    var path = _a.path, file = _a.file, quality = _a.quality, getOneTimeToken = _a.getOneTimeToken, slug = _a.slug;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (path) {
                        var sharp = require("sharp");
                        var inputStream = fs.createReadStream(path);
                        inputStream
                            .pipe(sharp()
                            .resize(MAX_WIDTH, MAX_HEIGHT)
                            .jpeg({ quality: quality * 10 }))
                            .toBuffer(function (err, buffer) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var base64Image_1 = "data:image/webp;base64,".concat(buffer.toString("base64"));
                                sendThumbnail({ base64Image: base64Image_1, getOneTimeToken: getOneTimeToken, file: file, slug: slug }).then(function () {
                                    resolve(base64Image_1);
                                });
                            }
                        });
                    }
                    else {
                        var imageURL_1 = URL.createObjectURL(file);
                        var image_1 = new Image();
                        image_1.src = imageURL_1;
                        var canvas_1 = document.createElement("canvas");
                        var ctx_1 = canvas_1.getContext("2d");
                        image_1.onload = function () {
                            var aspectRatio = image_1.width / image_1.height;
                            var newWidth = MAX_WIDTH;
                            var newHeight = MAX_HEIGHT;
                            if (image_1.width > image_1.height) {
                                newHeight = MAX_WIDTH / aspectRatio;
                            }
                            else {
                                newWidth = MAX_HEIGHT * aspectRatio;
                            }
                            canvas_1.width = newWidth;
                            canvas_1.height = newHeight;
                            ctx_1 === null || ctx_1 === void 0 ? void 0 : ctx_1.drawImage(image_1, 0, 0, newWidth, newHeight);
                            var qualityReduction = quality / 10;
                            var base64Image = canvas_1.toDataURL("image/jpeg", +qualityReduction);
                            URL.revokeObjectURL(imageURL_1);
                            sendThumbnail({ base64Image: base64Image, getOneTimeToken: getOneTimeToken, file: file, slug: slug }).then(function () {
                                resolve(base64Image);
                            });
                        };
                        image_1.onerror = function (error) {
                            reject(error);
                        };
                    }
                })];
        });
    });
};
export var getThumbnailVideo = function (_a) {
    var path = _a.path, file = _a.file, quality = _a.quality, getOneTimeToken = _a.getOneTimeToken, slug = _a.slug, ffmpegCommand = _a.ffmpegCommand;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (path && ffmpegCommand) {
                        var currentPath = process.cwd();
                        ffmpegCommand
                            .screenshot({
                            count: 1,
                            folder: "".concat(currentPath, "/src/"),
                            filename: "video-thumbnail.jpeg",
                            size: "".concat(MAX_WIDTH, "x").concat(MAX_HEIGHT),
                            timemarks: ["0.1"],
                        })
                            .on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var thumbnailPath, base64Image;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        thumbnailPath = "./src/video-thumbnail.jpeg";
                                        return [4 /*yield*/, getThumbnailImage({
                                                file: file,
                                                path: thumbnailPath,
                                                quality: quality,
                                                getOneTimeToken: getOneTimeToken,
                                                slug: slug,
                                            })];
                                    case 1:
                                        base64Image = _a.sent();
                                        fs.unlink(thumbnailPath, function (err) {
                                            err && console.error("Error deleting file:", err);
                                        });
                                        sendThumbnail({ base64Image: base64Image, getOneTimeToken: getOneTimeToken, file: file, slug: slug }).then(function () {
                                            resolve(base64Image);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .on("error", function (err) {
                            console.error("Error generating thumbnail:", err);
                            reject("Error generating thumbnail: ".concat(err));
                        });
                    }
                    else {
                        var video_1 = document.createElement("video");
                        video_1.src = URL.createObjectURL(file);
                        video_1.onloadedmetadata = function () {
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var aspectRatio = video_1.videoWidth / video_1.videoHeight;
                            var newWidth = MAX_WIDTH;
                            var newHeight = MAX_HEIGHT;
                            if (video_1.videoWidth > video_1.videoHeight) {
                                newHeight = MAX_WIDTH / aspectRatio;
                            }
                            else {
                                newWidth = MAX_HEIGHT * aspectRatio;
                            }
                            canvas.width = newWidth;
                            canvas.height = newHeight;
                            video_1.currentTime = 0.1;
                            video_1.onseeked = function () {
                                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video_1, 0, 0, newWidth, newHeight);
                                var qualityReduction = quality / 10;
                                var base64Image = canvas.toDataURL("image/jpeg", +qualityReduction.toFixed(1));
                                sendThumbnail({ base64Image: base64Image, getOneTimeToken: getOneTimeToken, file: file, slug: slug }).then(function () {
                                    resolve(base64Image);
                                });
                            };
                            video_1.onerror = function (error) {
                                reject(error);
                            };
                        };
                        video_1.onerror = function (error) {
                            reject(error);
                        };
                    }
                })];
        });
    });
};
var sendThumbnail = function (_a) {
    var base64Image = _a.base64Image, getOneTimeToken = _a.getOneTimeToken, file = _a.file, slug = _a.slug;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, token, endpoint, instance;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getOneTimeToken({
                        filename: file.name,
                        filesize: file.size,
                    })];
                case 1:
                    _b = (_c.sent()).data, token = _b.user_token.token, endpoint = _b.endpoint;
                    instance = axios.create({
                        headers: {
                            "x-file-name": file.name,
                            "Content-Type": "application/octet-stream",
                            "one-time-token": token,
                        },
                    });
                    if (!base64Image) return [3 /*break*/, 3];
                    return [4 /*yield*/, instance.post("".concat(endpoint, "/chunked/thumb/").concat(slug), base64Image)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
