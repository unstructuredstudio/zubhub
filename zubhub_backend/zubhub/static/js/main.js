
(function main(){
  
      function summerNote(){
    
        function sendFile(file, iframe_id){
          data = new FormData();
          data.append("file",file);
          data.append("folder","zubhub");
          $.ajax({
            url:`${document.location.origin}/api/upload_file/`,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
            headers: {
              "X-CSRFToken": getCookie('csrftoken')
             },
            success: function(data){
              const imgNode = document.createElement("img");
              const iframe = $(`iframe#${iframe_id}_iframe`);
              let public_id = data.image_url.split("/");
              public_id = public_id[public_id.length - 1]
              imgNode.setAttribute('id',public_id);
              imgNode.setAttribute('src', data.image_url);
              imgNode.setAttribute("style","max-width:100%;height:auto")
            $(".note-editable", iframe.contents()).append(imgNode);
            },
            error: function(jqXHR, textStatus, errorThrown){
              alert(textStatus+" "+errorThrown)
            }
          })
        };
  
        let mObserver = "";
  
        const mutationOptions = {
          childList: true,
          subtree: true,
        };
  
        const mCallback = (mutations, iframe_id) =>{
          for(let index in mutations){
            if(mutations[index].removedNodes.length > 0
            && mutations[index].removedNodes[0].src !== null
            && mutations[index].removedNodes[0].src !== undefined){
              makeDeleteRequest(mutations[index].removedNodes[0].src, iframe_id)
              .then(res=>{
                if(res["result"] !== "ok"){
                  alert(res["result"])
                }
              })
            }
          }
        };
  
        const t0 = performance.now();
  
        const overRideOnImageUpload = setInterval(()=>{
          if(!isSummernoteInitialized(getIframeIDs()).includes(false)){
  
            let observer;
            const iframe_id = getIframeIDs();
  
            for(let i=0; i < iframe_id.length; i++){
              window[`settings_${iframe_id[i]}`].callbacks.onImageUpload = function(files){
                sendFile(files[0], iframe_id[i])
              };
  
              const iframe = document.querySelector(`iframe#${iframe_id[i]}_iframe`);
  
              const iframe_inner_doc = iframe.contentDocument || iframe.contentWindow.document;
            
              const target_elem = iframe_inner_doc.querySelector(".note-editable");
              observer = new MutationObserver((mutations)=>mCallback(mutations, iframe_id[i]));
              observer.observe(target_elem, mutationOptions);
    
            }          
  
          clear();
          }
          if((performance.now() - t0) > 10000){
            clear()
          }
        },1000);
  
        function clear(){
          clearInterval(overRideOnImageUpload)
        }
      }
  
      summerNote();
  
    }())
  
  
    function getIframeIDs(){
      const iframes = document.querySelectorAll("iframe");
      if (!iframes.length) return []
      const id_arr  = [];
      for(let i=0; i < iframes.length; i++){
        id_arr.push(iframes[i].id.split("_iframe")[0])
      }
      return id_arr;
    }
  
    function isSummernoteInitialized(iframe_ids){
      if (!iframe_ids.length) return [false];
      return iframe_ids.map(iframe_id=> window[`settings_${iframe_id}`] 
                           && window[`settings_${iframe_id}`].callbacks 
                           && window[`settings_${iframe_id}`].callbacks.onImageUpload)
    }
  
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  
    function makeDeleteRequest(url, iframe_id){      
      let public_id = url.split("/");
      public_id = public_id[public_id.length - 1]
  
      if(url){
  
        const iframe = document.querySelector(`iframe#${iframe_id}_iframe`);
        const iframe_inner_doc = iframe.contentDocument || iframe.contentWindow.document;
        if(!iframe_inner_doc.querySelector(`#${public_id}`)){
  
            url = `${document.location.origin}/api/delete_file/`;
            data = new FormData();
            data.append("url", url);
  
            return fetch(url, 
              {method: 'POST',
              headers: new Headers({
                    "X-CSRFToken": getCookie('csrftoken'),
                            }),
              body: data}
            ).then(res=>res.json()).then(result=>result)
                      }
      }
    }