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
            var postfix = Math.random().toString(36).substring(2, 15);
            var filename = path.replace(/^.*[\\\/]/, '');
            var down_url = "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&access_token="+access_token+"&path="+path;
            var aria2_btn_id = "btn_copy_" + postfix;
            var filename_id = "filename_" + postfix;
            var down_url_id = "down_url_" + postfix;


            var aria2_button = "				<button type=\"submit\" class=\"btn btn-default\" id=\""+aria2_btn_id+"\" onclick='copyAria2Link(\""+postfix+"\")'>" +
                "					Copy Aria2" +
                "				</button>";


            $('#link_table').innerHTML =   "				<th>" +
                "					Name" +
                "				</th>" +
                "				<th>" +
                "					Download link" +
                "				</th>" +
                "				<th>" +
                "					Aria2" +
                "				</th>" +
                "			</tr>";

            $('#link_table tr:first').after("<tr><td id='"+filename_id+"'>"+filename+"</td><td id='"+down_url_id+"'>"+down_url+"</td><td>"+aria2_button+"</td></tr>");

        }
    });
}

function copyAria2Link(postfix) {
    var aria2_btn_id = "btn_copy_" + postfix;
    var filename_id = "filename_" + postfix;
    var down_url_id = "down_url_" + postfix;
    var filename = htmlDecode(document.getElementById(filename_id).innerHTML);
    var down_url = htmlDecode(document.getElementById(down_url_id).innerHTML);
    var aria2_cmd = "aria2c -s64 -x64 -k1M -o '" + filename + "' '" + down_url + "'";
    copyText(aria2_cmd);
    document.getElementById(aria2_btn_id).className = "btn btn-success";
}

function copyText(text){
    function selectElementText(element) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(element);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }
    var element = document.createElement('DIV');
    element.textContent = text;
    document.body.appendChild(element);
    selectElementText(element);
    document.execCommand('copy');
    element.remove();
}

function htmlDecode(input)
{
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}