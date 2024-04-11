import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import getMetaData from './scraper.js';
import prisma from './db/index.js';
import { createBookmark } from './db/index.js';
import { getDomain ,getImage} from './helper.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());



/**
 * 创建书签
 * url: string
 * title: string
 * description: string
 * imgage: string
 * site_name: string
 * tags: string
 */

app.post('/create', async (req, res) => {
    let {url,tags} = req.body;
    let metadata = await getMetaData(url);
    if(metadata){
        let {title,description} = metadata;
        let image = getImage(metadata);
        let data = {
            url,
            title,
            description,
            image,
            site_name: getDomain(url),
            tags: tags
        }
        const createData = await createBookmark(data);
        res.send({
            code: 200,
            message: 'Success',
            data: createData
        });
    }
    else{

        let data = {
            url,
            title: url,
            description: 'No description',
            image: 'https://logo.clearbit.com/'+getDomain(url),
            site_name: getDomain(url),
            tags: tags
        }
        const createData = await createBookmark(data);
        res.send({
            code: 201,
            message: '获取失败，已创建书签',
            data: createData
        });
    }

    
});


// 插件按钮添加书签


app.post('/insert', async (req, res) => {
    let {url,title,description,image,tags} = req.body;
    
    let data = {
        url,
        title,
        description,
        image,
        site_name: getDomain(url),
        tags: tags
    }
    const createData = await createBookmark(data);
    res.send({
        code: 200,
        message: 'Success',
        data: createData
    });
});

/**
 * 获取所有书签
 */
app.get('/all', async (req, res) => {
    const allData = await prisma.bookmarks.findMany();
    res.send({
        code: 200,
        message: 'Success',
        data: allData
    });
});



/**
 * 获取所有的tags
 */
app.get('/getTags',async (req,res) => {
    const allTags = await prisma.bookmarks.findMany({
        select:{
            tags:true
        }
    })
    const tags = []
    allTags.forEach(item => {
        item.tags.split(" ").forEach((tag,index) => {
            if(!tags.includes(tag)){
                tags.push(tag)
            }
        })
    })
    res.send({
        code: 200,
        message: 'Success',
        data: tags
    });
})



/**
 * 根据tag获取书签
 */
app.post('/tagList', async (req, res) => {
    const {tag} = req.body;
    // console.log(tag);
    const allData = await prisma.bookmarks.findMany({
        where:{
            tags: {
                contains: tag,
            },
        }
    });
    res.send({
        code: 200,
        message: 'Success',
        data: allData
    });
});

/**
 * 根据搜索关键字获取书签
 */
app.post('/search', async (req, res) => {
    const {keyword} = req.body;
    const allData = await prisma.bookmarks.findMany({
        where:{
            OR:[
                {
                    title:{
                        contains: keyword
                    }
                },
                {
                    description:{
                        contains: keyword
                    }
                },
                {
                    tags:{
                        contains: keyword
                    }
                }
            ]
        }
    });
    res.send({
        code: 200,
        message: 'Success',
        length: allData.length,
        data: allData
    });
});


/**
 * 删除
 */
app.post('/delete', async (req, res) => {
    const {id} = req.body;
    const deleteData = await prisma.bookmarks.delete({
        where:{
            id: id
        }
    });
    res.send({
        code: 200,
        message: 'Success',
        data: deleteData
    });
});



/**
 * 点击量+1
 */
app.post('/hits', async (req, res) => {
    const {id} = req.body;
    const hitsData = await prisma.bookmarks.update({
        where:{
            id: id
        },
        data:{
            hits:{
                increment: 1
            }
        }
    });
    res.send({
        code: 200,
        message: 'Success',
        // data: hitsData
    });
});


/**
 * 获取点击量最高的5条数据
 */
app.get('/mostHits', async (req, res) => {
    const mostHits = await prisma.bookmarks.findMany({
        take: 5,
        where:{
            hits:{
                // 大于10
                gt: 5
            }
        },
    });
    res.send({
        code: 200,
        message: 'Success',
        data: mostHits
    });
});

app.listen(3000, () => {
    console.log(`[Server] Server is running on http://localhost:3000`);
});
