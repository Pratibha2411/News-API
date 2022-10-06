//importing packages express,axios,cheerio
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

// ROUTING IN EXPRESS
const PORT = 8080

// calling express and defining it in a variable so that we can use new express application by using this varibale inn our project
const app = express()

const newspapers = [
    {
        name: "thetimes uk",
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: "guardian",
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: "telegraph",
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
    
        $('a:contains("climate")', html).each(function (){
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})


app.get('/', (req,res) =>{
    res.json('Welcome to the News Api')
})

app.get('/news', (req, res) =>{
// //to loop over the publications commenting this function and creating 
        // axios.get('https://www.theguardian.com/environment/climate-crisis')
        //     .then((response) =>{
        //         const html = response.data
        //         // console.log(html);
        //         const $ = cheerio.load(html)

        //         $('a:contains("climate")', html).each(function () {
        //             const title = $(this).text()
        //             const url = $(this).attr('href')
        //             articles.push({
        //                title,
        //                url 
        //             })
        //         })
        //         res.json(articles)
        //     }).catch((err) => console.log(err));
                res.json(articles)
})

app.get('/news/:newspaperId',(req, res) => {
    // console.log(req.params.newspaperId) 
     const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address 
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base 
    // console.log(newspaperAddress);
     axios.get(newspaperAddress)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
       res.json(specificArticles)
      })
      .catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))