/* global _ */
var fs = require("zed/fs");

module.exports = function(info) {
    var code = info.inputs.text;
    var MESSAGE_RE = /^stdin:(\d+):(\d+):\s*(.+)$/;

    return fs.run(["pep8", "-"], code).then(function(results) {
        var lines = results.split("\n");
        var annos = [];
        _.each(lines, function(line) {
            if(!line) {
                return;
            }
            var m = MESSAGE_RE.exec(line);
            if (m) {
                var message = m[3];
                annos.push({
                    row: m[1] - 1,
                    text: '[PEP8] ' + message,
                    type: 'warning'
                });
            } else {
                console.error("Invalid output from PEP8:", line);
            }
        });
        return annos;
    });
};
