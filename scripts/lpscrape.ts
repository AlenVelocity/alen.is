import axios from 'axios'
import { writeFileSync } from 'fs'
import { load } from 'cheerio'

const teams = [
    'https://liquipedia.net/valorant/100_Thieves',
    'https://liquipedia.net/valorant/Cloud9',
    'https://liquipedia.net/valorant/Evil_Geniuses',
    'https://liquipedia.net/valorant/FURIA_Esports',
    'https://liquipedia.net/valorant/KR%C3%9C_Esports',
    'https://liquipedia.net/valorant/Leviat%C3%A1n',
    'https://liquipedia.net/valorant/LOUD',
    'https://liquipedia.net/valorant/MIBR',
    'https://liquipedia.net/valorant/NRG',
    'https://liquipedia.net/valorant/Sentinels',
    'https://liquipedia.net/valorant/G2_Esports',
    'https://liquipedia.net/valorant/All_Gamers',
    'https://liquipedia.net/valorant/Bilibili_Gaming',
    'https://liquipedia.net/valorant/EDward_Gaming',
    'https://liquipedia.net/valorant/FunPlus_Phoenix',
    'https://liquipedia.net/valorant/JD_Gaming',
    'https://liquipedia.net/valorant/Nova_Esports',
    'https://liquipedia.net/valorant/Titan_Esports_Club',
    'https://liquipedia.net/valorant/Trace_Esports',
    'https://liquipedia.net/valorant/TYLOO',
    'https://liquipedia.net/valorant/Wolves_Esports',
    'https://liquipedia.net/valorant/Dragon_Ranger_Gaming',
    'https://liquipedia.net/valorant/BBL_Esports',
    'https://liquipedia.net/valorant/Fnatic',
    'https://liquipedia.net/valorant/FUT_Esports',
    'https://liquipedia.net/valorant/Karmine_Corp',
    'https://liquipedia.net/valorant/KOI',
    'https://liquipedia.net/valorant/Natus_Vincere',
    'https://liquipedia.net/valorant/Team_Heretics',
    'https://liquipedia.net/valorant/Team_Liquid',
    'https://liquipedia.net/valorant/Team_Vitality',
    'https://liquipedia.net/valorant/Gentle_Mates',
    'https://liquipedia.net/valorant/GIANTX',
    'https://liquipedia.net/valorant/DetonatioN_FocusMe',
    'https://liquipedia.net/valorant/DRX',
    'https://liquipedia.net/valorant/Gen.G_Esports',
    'https://liquipedia.net/valorant/Global_Esports',
    'https://liquipedia.net/valorant/Paper_Rex',
    'https://liquipedia.net/valorant/Rex_Regum_Qeon',
    'https://liquipedia.net/valorant/T1',
    'https://liquipedia.net/valorant/Talon_Esports',
    'https://liquipedia.net/valorant/Team_Secret',
    'https://liquipedia.net/valorant/ZETA_DIVISION',
    'https://liquipedia.net/valorant/Bleed_Esports'
]

/**<div class="floatnone"><a href="/valorant/File:ZETA_DIVISION_darkmode.png" class="image"><img alt="" src="/commons/images/thumb/9/95/ZETA_DIVISION_darkmode.png/600px-ZETA_DIVISION_darkmode.png" decoding="async" width="600" height="600" srcset="/commons/images/thumb/9/95/ZETA_DIVISION_darkmode.png/900px-ZETA_DIVISION_darkmode.png 1.5x, /commons/images/thumb/9/95/ZETA_DIVISION_darkmode.png/1200px-ZETA_DIVISION_darkmode.png 2x"></a></div> */

const scrapeImage = async (team: string) => {
    try {
        const response = await axios.get(team)
        const $ = load(response.data)
        const imageUrl = $('div.floatnone a.image img').attr('src')
        if (imageUrl) {
            const imageResponse = await axios.get(`https://liquipedia.net${imageUrl}`, { responseType: 'arraybuffer' })
            const teamName = team.split('/')[4]
            writeFileSync(`./public/teams/${teamName}.png`, imageResponse.data)
            console.log(`Successfully scraped image for ${teamName}`)
            return imageUrl
        } else {
            console.log(`No image found for ${team}`)
            return null
        }
    } catch (error) {
        console.error(`Error scraping image for ${team}:`, error)
        return null
    }
}

const scrapeTeam = async (team: string) => {
    const imageUrl = await scrapeImage(team)
    return imageUrl
}

const scrapeAllTeams = async () => {
    const teamImages = []
    for (const team of teams) {
        const imageUrl = await scrapeTeam(team)
        teamImages.push(imageUrl)
        // Add a delay between requests to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 2000))
    }
    return teamImages
}

scrapeAllTeams()
    .then((teamImages) => {
        console.log('All team images scraped:', teamImages)
    })
    .catch((error) => {
        console.error('Error scraping team images:', error)
    })
