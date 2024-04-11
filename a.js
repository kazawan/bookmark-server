// const a = "#a #b #c"

const b = "#d r #f"


const tags = b.split(' ').filter(item => item !== '');

tags.forEach((item,i) => {
    if(!item.startsWith('#')){
        // tags[i-1] = tags[i-1] + ' ' + item;
        tags.splice(i,1);
    }
})

console.log(tags);