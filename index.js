const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/article/coronavirus-3g6vmvrpt',
        base: ''
    },
    {
        name: 'ap',
        address: 'https://apnews.com/hub/coronavirus-pandemic',
        base: 'https://apnews.com'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak',
        base: '',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/interactive/2021/world/covid-cases.html',
        base: 'https://www.nytimes.com',
    },
    {
        name: 'wp',
        address: 'https://www.washingtonpost.com/coronavirus/',
        base: '',
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("covid"),a:contains("coronavirus"),a:contains("covid-19"),a:contains("pandamic")', html).each(function () {
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

app.get('/', (req, res) => {
    res.json('Welcome to my Covid-19 News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("covid"),a:contains("coronavirus"),a:contains("covid-19"),a:contains("pandamic"),a:contains("covid19")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))