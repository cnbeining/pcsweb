// Empty JS for your own code to be here

function onload_load_config() {
    var access_token = localStorage.getItem("access_token");
    var base_url = localStorage.getItem("base_url");

    if (access_token == null || base_url == null) {
        console.log('No info in storage');
        document.getElementById("btn_check_access").className = "btn btn-primary";
    } else {
        document.getElementById("access_token").value = access_token;
        document.getElementById("base_url").value = base_url;
    }
}

function check_token() {
    var access_token = document.getElementById("access_token").value;
    var base_url = document.getElementById("base_url").value;

    // $.getJSON("https://pcs.baidu.com/rest/2.0/pcs/file?method=list&access_token="+access_token+"&path="+base_url+"&callback=?",function(data){
    //     for (var i=0, l=data['list'].length; i<l; i++) {
    //         console.log(data['list'][i]);
    //         var path = data['list'][i]['path'];
    //     }
    // });

    $.getJSON("https://pcs.baidu.com/rest/2.0/pcs/quota?method=info&access_token="+access_token+"&callback=?",function(data){
        if ("quota" in data) {

            if (typeof(Storage) !== "undefined") {
                // Store
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("base_url", base_url);

                // Retrieve
                //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
            } else {
                document.getElementById("btn_check_access").className = "btn btn-warning";
                console.log('NO storage supported!')
            }

            document.getElementById("btn_check_access").className = "btn btn-success";
            return true;
        }
    });
}

function sync() {
    var access_token = document.getElementById("access_token").value;
    var base_url = document.getElementById("base_url").value;

    $.getJSON("https://pcs.baidu.com/rest/2.0/pcs/file?method=list&access_token="+access_token+"&path="+base_url+"&callback=?",function(data){
        for (var i=0, l=data['list'].length; i<l; i++) {
            var path = data['list'][i]['path'];
            var filename = path.replace(/^.*[\\\/]/, '');
            var down_url = "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&access_token="+access_token+"&path="+path;

            $('#link_table tr:first').before("<tr><td>"+filename+"</td><td>"+down_url+"</td></tr>");

        }
    });
}