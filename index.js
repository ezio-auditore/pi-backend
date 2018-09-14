
var fs = require('fs'),
    request = require('request');
var admin = require("firebase-admin");

var serviceAccount = require("./stark-home-firebase-adminsdk-lrpx9-21db3dc36e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stark-home.firebaseio.com"
});


var db = admin.database();
var ref = db.ref("/torrents")

ref.orderByKey() // order by chlidren's keys
  .limitToLast(1) // only get the last child
  .on("child_added", function(snapshot) {
    console.log(snapshot.key + "  " + snapshot.val().url);
    downloadTorrentFile(snapshot.val().url,snapshot.key);
  });


function downloadTorrentFile(url,id){
  var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    if (err){
      console.log(err);

    }
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
download(url, `/home/pi/torrent-queue/${id}.torrent`, function(){
  console.log('done');
});

}
