var cluster = require('cluster');
var workers = 2;//2 cpu cores used

if (cluster.isMaster) {
  console.log('Scaling bot over %s cores.', workers);

  for (var i = 0; i < workers; ++i) {
	var env_var = {};
	env_var["WORKER_ID"] = i;
    var worker = cluster.fork(env_var);
    console.log('worker %s started.', i);
  }

  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });

} else {
	require("./melly.js").init(cluster.worker.process.env["WORKER_ID"] == 0);
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});
