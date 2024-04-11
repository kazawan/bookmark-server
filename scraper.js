import urlMetadata from "url-metadata";
// getMetaData(url).then(data => console.log(data));


const getMetaData = async (url) => {
    try{
        const metadata = await urlMetadata(url);
        return metadata;
    }catch(err){
        // console.log(err);
        return false;
    }
    
}

export default getMetaData;
