export var saveBlob = function (_a) {
    var name = _a.name, blob = _a.blob;
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
};
