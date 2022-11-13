//npm install python-shell
module.exports = function(RED) {
    function GpioIn(config) {
        RED.nodes.createNode(this,config);

        this.pin = config.pin;
        this.read = config.read || false;
        

        var node = this;
        var gpioCommand = __dirname+'/encoder.sh';
        var spawn = require("child_process").spawn;
        //FIX ME
        //node.child = spawn(gpioCommand, [this.pin, out, 100, 0, false]);
        node.child = spawn(gpioCommand,[this.pin]);

        console.log("Spawning child process");
        var out = 0;
        node.child.stdout.on('data', function (data) {
            var d = data.toString().trim().split("\n");
            for (var i = 0; i < d.length; i++) {
                if (d[i] === '') { return; }
                else{node.send({ topic:"gpio/"+node.pin, payload:Number(d[i]) });}
            }
        });

        node.child.on('close', function (code) {
            node.child.removeAllListeners();
            delete node.child;
            node.finished();
        });
        
        node.on("close", function(done) {
            if (node.child != null) {
                node.finished = done;
                node.child.stdin.write("close", () => {
                    if (node.child) {
                        node.child.kill('SIGKILL');
                    }
                });
            }
            else { if (done) { done(); } }
        });
    }
    RED.nodes.registerType("ftk encoder",GpioIn);
}
