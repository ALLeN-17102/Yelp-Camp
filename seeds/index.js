const mongoose= require('mongoose');
const cities= require('./cities');
const {places,descriptors}=require('./seedHelpers')
const Campground= require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
useNewUrlParser:true,useUnifiedTopology:true
})
.then(()=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})

const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDB =async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++)
    {
        const random = Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'65fd3def388d760929103361',
            location:`${cities[random].city} , ${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/2184453/50X50',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est magnam, voluptas exercitationem debitis voluptatibus repellendus.',
            price,
            geometry: { type: 'Point', coordinates: [ cities[random].longitude,cities[random].latitude ] },
            images:[
                {
                    url: 'https://res.cloudinary.com/dipjm9o3o/image/upload/v1711298191/YelpCamp/pqdto9v2vsx847gmv5wl.jpg',
                    filename: 'YelpCamp/pqdto9v2vsx847gmv5wl'
                   
                  },
                  {
                    url: 'https://res.cloudinary.com/dipjm9o3o/image/upload/v1711298191/YelpCamp/cesivljtct6jm4ijosi1.jpg',
                    filename: 'YelpCamp/cesivljtct6jm4ijosi1'
                    
                  }
            ]
            // price:p
            
        })
        await camp.save();
    }
   
}

seedDB().then(()=>{
    mongoose.connection.close;
});