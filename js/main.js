$(document).ready(() => {
  doAjax('potato');
  $('#searchForm').on('keyup ', (e) => {
      e.preventDefault();
   var searchText = $('#searchText').val();
   doAjax(searchText);
  });
});

// global variable
// used in jsonFlickrFeed() and flickrPhoto()
var jsonResult;

function doAjax(tag) {
  //i made doAjax  to be reusable for other tags
  hideDetail();
  $('.container').html(" ");
  $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + tag + '&tagmode=all&format=json',
  });
}

function getMonth(index) {
  // return month
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

function getDateFormated(string) {
  // return date 
  var date = new Date(string);
  var dateString = date.getDate() +
    " " + getMonth(date.getMonth()) +
    " " + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
  return dateString;
}

function jsonFlickrFeed(items) {
  jsonResult = items;
  var $output = $('.container');
  $.each(items.items, (i, item) => {
    var date = getDateFormated(item.published);

    $output.append(`
        <div class="row">
          <div class='col-md-3 '>
            <img  src="${item.media.m}" width="290" height="200" id="main-page-image" class="mb-2 mt-2">
          </div>
          <div class=' id="content-container" col-md-9 mt-1 '>
            <h4 class="title"><a href="#" onclick="flickrPhoto(${i});">${item.title}<a/><h4>
            <p>Published: ${date}<p>
            <li> <a target="_blank" href="https://www.flickr.com/people/${item.author_id}">Photo author</a></li>
            <li> <a target="_blank" href="${item.link}">View on Flickr</a></li>
          </div>
        </div>
     `)
  });

}

function flickrPhoto(id) {
  var item = jsonResult.items[id];
  var date = getDateFormated(item.published);

  // convert tags to links
  var tagsArray = item.tags.split(" ");
  var tagsArray2 = tagsArray.map(function(tag){
    return `<a href="#" onclick="doAjax('${tag}')" > ${tag} </a>`;
  });
  var tagsString = tagsArray2.join(" ");


  $('.photo_details').html(` 
     <div id="wrapper-content-photo_details">
       <a href="#" onclick="hideDetail()" class="btn btn-primary">BACK </a>
       <h3><a href="${item.media.m}" target="_blank"> ${item.title} </a> </h3>
       <span> <a target="_blank" href="https://www.flickr.com/people/${item.author_id}">${item.author}</a> </span> | Published ${date}
       <hr>
       <div id="description-detail-page">${item.description}</div>
        <div id="tags">Tags: ${tagsString} </div>
    </div>
    `);
  $('.photo_details').css("display", "block" );

}

function hideDetail() {
  // hide and remove everything from photo_details

  $('.photo_details').html("");
  $('.photo_details').css("display", "none" );
}
