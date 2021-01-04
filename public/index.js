const socket = io("http://localhost:65080");
var userName;
if(location.search.substring(1) == ""){
  userName = prompt('Username: ');
} else {
  username = getUserName();
} 
function getPageNumber(){
  var pageNumber = 0;
  if(location.search.substring(1) == ""){
    pageNumber = 0;
  } else {
    pageNumber = parseInt(location.search.substring(1).split("&")[2]);
  }
  return pageNumber;
}

socket.emit("load-posts");
// initializes socket on website url.
/*else if(location {
  var the_ID = getID();
  socket.emit("update-comments", (the_ID));
}*/
function alertExample(){
  alert("Example!");
}

function postFormFilled(){
  // Text area input 
  var postText = document.getElementById("textareaID").value;
 
  // Code to retrieve date
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var timeZone = new Date('Dec 29 2020 19:00:00 CST');


  // Code to retrieve time
  var hour = timeZone.getHours();
  var minutes = 0;
  var am_pm = "";
  // Convert military time and store hour, minutes, am/pm 
  if(d.getHours >= 0 && d.getHours <= 12)
  {
    am_pm = "AM";
  } else {
    am_pm = "PM";
  } 

  // Get minutes
  minutes = d.getMinutes();
  var parentID = getID();
  var formArray = [postText, userName, month, day, year, hour, minutes, am_pm, parentID];
  socket.emit("post-button", (formArray));

}


function commentFormFilled(){
  // Text area input 
  var postText = document.getElementById("textareaID").value;
 
  // Code to retrieve date
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var timeZone = new Date('Dec 29 2020 19:00:00 CST');


  // Code to retrieve time
  var hour = timeZone.getHours();
  var minutes = 0;
  var am_pm = "";
  // Convert military time and store hour, minutes, am/pm 
  if(d.getHours >= 0 && d.getHours <= 12)
  {
    am_pm = "AM";
  } else {
    am_pm = "PM";
  } 

  // Get minutes
  minutes = d.getMinutes();
  var parentID = getID();
  var formArray = [postText, userName, month, day, year, hour, minutes, am_pm, parentID];
  socket.emit("post-comment", (formArray));

}



// Displaying database information

var zero;
var one; 
var two; 
var three;
var four;
var five;
if(getPageNumber() == 0){
  zero = 0;
  one = 1;
  two = 2;
  three = 3;
  four = 4;
  five = 5;
}
if(getPageNumber() != 0){
  var start = 6*getPageNumber(); 
  zero = start;
  one = start+1; 
  two = start+2;
  three = start + 3;
  four = start + 4;
  five = start + 5;
}



var postsOnPage;
socket.on("Focused-Post", (result) => {
  document.getElementById("user1").innerHTML = result.Author;
  document.getElementById("post1").innerHTML = result.Post_Content;
  document.getElementById("time-date").innerHTML = result.Month + "/" + result.Day + "/" + result.Year + " at " + result.Hour + ":" + result.Minute + " " + result.AM_PM;
});

socket.on("display-comments", (result) => {

  document.getElementById("user2").innerHTML = result[zero].Author;
  document.getElementById("post2").innerHTML = result[zero].Post_Content;
  document.getElementById("time-date2").innerHTML = result[zero].Month + "/" + result[zero].Day + "/" + result[zero].Year + " at " + result[zero].Hour + ":" + result[zero].Minute + " " + result[zero].AM_PM;


  document.getElementById("user3").innerHTML = result[one].Author;
  document.getElementById("post3").innerHTML = result[one].Post_Content;
  document.getElementById("time-date3").innerHTML = result[one].Month + "/" + result[one].Day + "/" + result[one].Year + " at " + result[one].Hour + ":" + result[one].Minute + " " + result[one].AM_PM;

  document.getElementById("user4").innerHTML = result[two].Author;
  document.getElementById("post4").innerHTML = result[two].Post_Content;
  document.getElementById("time-date4").innerHTML = result[two].Month + "/" + result[two].Day + "/" + result[two].Year + " at " + result[two].Hour + ":" + result[two].Minute + " " + result[two].AM_PM;


  document.getElementById("user5").innerHTML = result[three].Author;
  document.getElementById("post5").innerHTML = result[three].Post_Content;
  document.getElementById("time-date5").innerHTML = result[three].Month + "/" + result[three].Day + "/" + result[three].Year + " at " + result[three].Hour + ":" + result[three].Minute + " " + result[three].AM_PM;


  document.getElementById("user6").innerHTML = result[four].Author;
  document.getElementById("post6").innerHTML = result[four].Post_Content;
  document.getElementById("time-date6").innerHTML = result[four].Month + "/" + result[four].Day + "/" + result[four].Year + " at " + result[four].Hour + ":" + result[four].Minute + " " + result[four].AM_PM;



});



socket.on("display-posts", (result) => {

  var zero;
  var one; 
  var two; 
  var three;
  var four;
  var five;
  if(getPageNumber() == 0){
    zero = 0;
    one = 1;
    two = 2;
    three = 3;
    four = 4;
    five = 5;
  }
  if(getPageNumber() != 0){
    var start = 6*getPageNumber(); 
    zero = start;
    one = start+1; 
    two = start+2;
    three = start + 3;
    four = start + 4;
    five = start + 5;
  }
  postsOnPage = result;

  if(typeof result[zero] === 'undefined'){
    console.log('Post #0 is undefined')
  } else {
    document.getElementById("user1").innerHTML = result[zero].Author;
    if(result[zero].Parent_Comment_ID != ""){
      document.getElementById("post1").innerHTML = result[zero].Post_Content;
      getParentName(result[zero].Parent_Comment_ID, 1);
    } else {
      document.getElementById("post1").innerHTML = result[zero].Post_Content;
    }
    document.getElementById("time-date").innerHTML = result[zero].Month + "/" + result[zero].Day + "/" + result[zero].Year + " at " + result[zero].Hour + ":" + result[zero].Minute + " " + result[zero].AM_PM;
  }

  if(typeof result[one] === 'undefined'){
    console.log('Post #1 is undefined')
  } else {
    document.getElementById("user2").innerHTML = result[one].Author;
    
    if(result[zero].Parent_Comment_ID != ""){
      document.getElementById("post2").innerHTML = result[one].Post_Content;
      getParentName(result[one].Parent_Comment_ID, 2);
    } else {
      document.getElementById("post2").innerHTML = result[one].Post_Content;
    }
    document.getElementById("time-date2").innerHTML = result[one].Month + "/" + result[one].Day + "/" + result[one].Year + " at " + result[one].Hour + ":" + result[one].Minute + " " + result[one].AM_PM;
  }


  if(typeof result[two] === 'undefined'){
    console.log('Post #2 is undefined')
  } else {
    document.getElementById("user3").innerHTML = result[two].Author;
    if(result[zero].Parent_Comment_ID != ""){
      document.getElementById("post3").innerHTML = result[two].Post_Content;
      getParentName(result[one].Parent_Comment_ID, 3);
    } else {
      document.getElementById("post3").innerHTML = result[two].Post_Content;
    }
    document.getElementById("time-date3").innerHTML = result[two].Month + "/" + result[two].Day + "/" + result[two].Year + " at " + result[two].Hour + ":" + result[two].Minute + " " + result[two].AM_PM;
  }


  if(typeof result[three] === 'undefined'){
    console.log('Post #3 is undefined')
  } else {
    document.getElementById("user4").innerHTML = result[three].Author;
    if(result[three].Parent_Comment_ID != ""){
      document.getElementById("post4").innerHTML = result[three].Post_Content;
      getParentName(result[three].Parent_Comment_ID, 4);
    } else {
      document.getElementById("post4").innerHTML = result[three].Post_Content;
    }
    document.getElementById("time-date4").innerHTML = result[three].Month + "/" + result[three].Day + "/" + result[three].Year + " at " + result[three].Hour + ":" + result[three].Minute + " " + result[three].AM_PM;
  }


  if(typeof result[four] === 'undefined'){
    console.log('Post #4 is undefined')
  } else {
    document.getElementById("user5").innerHTML = result[four].Author;

    if(result[three].Parent_Comment_ID != ""){
      document.getElementById("post5").innerHTML = result[four].Post_Content;
      getParentName(result[four].Parent_Comment_ID, 5);
    } else {
      document.getElementById("post5").innerHTML = result[four].Post_Content;
    }
    document.getElementById("time-date5").innerHTML = result[four].Month + "/" + result[four].Day + "/" + result[four].Year + " at " + result[four].Hour + ":" + result[four].Minute + " " + result[four].AM_PM;
  }


  if(typeof result[five] === 'undefined'){
    console.log('Post #5 is undefined')
  } else {
    document.getElementById("user6").innerHTML = result[five].Author;

    if(result[three].Parent_Comment_ID != ""){
      document.getElementById("post6").innerHTML = result[five].Post_Content;
      getParentName(result[five].Parent_Comment_ID, 6);
    } else {
      document.getElementById("post6").innerHTML = result[five].Post_Content;
    }
    document.getElementById("time-date6").innerHTML = result[five].Month + "/" + result[five].Day + "/" + result[five].Year + " at " + result[five].Hour + ":" + result[five].Minute + " " + result[five].AM_PM;
  }
});




function getParentName(id, num){
  socket.emit("get_parent_name", (id));
  
  socket.on("receive_parent_name", (result) => {
    var original = document.getElementById("post"+num).innerHTML;
    if(original[0] != "@"){
      var newPost = "@" + result.Author + " | " + original;
      document.getElementById("post"+num).innerHTML = newPost;
    }
  });
}

function nextPage(){
  var URL = "";
  var nextPageNumber = getPageNumber() + 1;
  if(location.search.substring(1) == ""){
    URL = "index" + "?" + "browsing" + "&" + userName + "&" + nextPageNumber;
  } else {
    URL = "index" + "?" + "browsing" + "&" + getUserName() + "&" + nextPageNumber;
  }
  location.href=URL;
}

function previousPage(){
  var URL = "";
  var pageCheck = location.search.substring(1).split('&');
  var nextPageNumber = getPageNumber() - 1;
  if(location.search.substring(1) == "" || getPageNumber() == 0){

  } else {
    URL = "index" + "?" + "browsing" + "&" + getUserName() + "&" + nextPageNumber;
    location.href=URL;
  }
}



function redirect(num){
  var post_Number = parseInt(num);
  console.log(post_Number);
  socket.emit("get-array");
  socket.on("receive-array", (result) => {
    var URL = "comments.ejs?" + result[post_Number]._id + "&" + userName + "&" + getPageNumber();
    location.href=URL;
  });
  /* 
  var postNumber = parseInt(num);
  var _id = commentPage(postNumber); 
  var URL = "comments.ejs?" + _id;
  location.href=URL;
  */
}


function getID(){
  var id = location.search.substring(1).split("&");
  return id[0];
}

function getUserName(){
  var name = location.search.substring(1).split("&");
  return name[1];
}

function commentPage(postNumber){
  socket.emit("load-posts");
  var id = "";
  socket.on("getPostsOnPage", (posts) => {
    id = posts[postNumber]._id;
  });
  console.log(id);
  var postID = id;
  return postID;
}

socket.on("display-users", (users) => {
  document.getElementById("user1").innerHTML = users[zero].name;
  document.getElementById("post1").innerHTML = users[zero].bio;
  document.getElementById("user2").innerHTML = users[one].name;
  document.getElementById("post2").innerHTML = users[one].bio;
});
