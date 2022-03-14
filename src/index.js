const express = require("express");
const axios = require("axios");
const { json } = require("express");
var cors = require('cors')
require("dotenv").config();//informa��es para o header, url para facilitar o processo de pegar informa��es.
const app = express();

app.use(cors())
app.listen(process.env.PORT || 3333);

app.post('/summoner/:summoner', async(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    //Pegar as informa��es b�sicas tipo os ids para pegarem mais informa��es
    const { summoner } = req.params;
    let user = await axios({
        method : 'get',
        baseURL: `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
        headers: {'X-Riot-Token': 'RGAPI-969ebe35-c99e-4ba3-a3fb-3967709f3169'}
    }).then((res)=>{
        return res.data;
    })
    //Pegar as informa��es mais elaboradas tipo quantidade de vit�rias ranked
    let summonerInfo = await axios({
        method : 'get',
        baseURL: `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.id}`,
        headers: {'X-Riot-Token': 'RGAPI-969ebe35-c99e-4ba3-a3fb-3967709f3169'}
    }).then((res)=>{
        return res.data;
    })
    //Pegar a vers�o que est� o �cone
    let Icons = await axios({
        method : 'get',
        baseURL: `https://ddragon.leagueoflegends.com/api/versions.json`,
    }).then((res)=>{
        return res.data;
    })
    
    let icons = Icons[0];
    
    //Pegar as informa��es da vari�vel user.
    const { profileIconId, name } = user; 
    
    //if para montar um json com as informa��es organizadas para ser mandado para o front end
    if(summonerInfo[0] == undefined){
        res.json({
            profileIconId,
            name,
            icons
        }); 
    }else{
        //Pegar as informa��es da vari�vel summerInfo
        const { tier, rank, wins, losses, queueType } = summonerInfo[0];
        res.json({
            profileIconId,
            tier,
            rank,
            wins,
            losses,
            queueType,
            name,
            icons
        });
    }
    
})
