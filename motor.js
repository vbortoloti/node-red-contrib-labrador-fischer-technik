//npm install python-shell
module.exports = function(RED) {
    function GpioInMotor(config) {
        RED.nodes.createNode(this,config);

        this.pin = config.pin;
        this.read = config.read || false;

        var node = this;
        var gpioCommand = __dirname+'/motor.sh';
        var spawn = require("child_process").spawn;
        node.child = spawn(gpioCommand,[this.pin]);
        console.log("Spawning child process");
        
        var out = 0;
        function inputlistener(msg, send, done) {
            if(msg.payload == "true" || msg.payload == "1"){
                out = 1;
            }else if(msg.payload == "false" || msg.payload == "0"){
                out = 0;
            }

            if (node.child !== null) {
                node.child.stdin.write(out+"\n", () => {
                    if (done) { done(); }
                });
            }else {
                console.log("erro")
            }
            node.send(msg);
        }
        node.on('input',inputlistener);

        
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
    RED.nodes.registerType("ftk motor en",GpioInMotor);
}
