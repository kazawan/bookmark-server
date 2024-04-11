import prisma from "./db/index.js";
const url  = "www.google.com"
const metadata = {
    general: {
        title: "Google",
        description: "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
        image: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        tags: "search",
        site_name: "Google"
    }
};

const metadata2 = {
    general: {
        title:"baidu",
        description:"百度一下，你就知道",
        image:"https://www.baidu.com/img/bd_logo1.png",
        tags:"search china" ,
        site_name:"baidu"

    }
};

const metadata3 = {
    general: {
        title:"bing",
        description:"Bing helps you turn information into action, making it faster and easier to go from searching to doing.",
        image:"https://www.bing.com/th?id=OIP.1zQq9X1yH6tJ3hZl1qXrJwHaHa&pid=Api",
        tags:"search china",
        site_name:"bing"
    }
};




async function insertBookmark(url,metadata){
    const res = await prisma.bookmarks.create({
        data:{
            url,
            title: metadata.general.title,
            description: metadata.general.description,
            image: metadata.general.image,
            tags: metadata.general.tags,
            site_name: metadata.general.site_name
        }
    })
}

async function main(){
    await insertBookmark(url,metadata);
    await insertBookmark(url,metadata2);
    await insertBookmark(url,metadata3);

}

async function findTags(){
    const res = await prisma.bookmarks.findMany({
        where:{
            tags: {
                contains: "china",
            },
        }
    })
    console.log(res)
}


async function findAllTags(){
    const res = await prisma.bookmarks.findMany({
        select:{
            tags: true
        }   
    })
    if(res.length === 0){
        return
    }
    const tags = []
    res.forEach(item => {
        item.tags.split(" ").forEach(tag => {
            if(!tags.includes(tag)){
                tags.push(tag)
            }
        })
    })
    console.log(tags)
}

// main()
// findTags()
// findAllTags()
