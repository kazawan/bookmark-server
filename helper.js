export function getDomain(url) {
  return url.split('/')[2];
}

export function getImage(data){
    if(data["og:image"]){
        return data["og:image"];
    }else if(data.image){
        return data.image; 
    }else if(data["twitter:image"]){
        return data["twitter:image"];
    }else{
        return 'https://logo.clearbit.com/'+getDomain(data.url);
    }
}




