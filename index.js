const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const welcomeChannelName = "✨안녕하세요" // 입장 시 환영메시지를 전송 할 채널의 이름을 입력하세요.
const byeChannelName = "✨안녕히가세요" // 퇴장 시 메시지를 전송 할 채널의 이름을 입력하세요.
const welcomeChannelComment = "이서버에 오신걸 환영합니다.✨" // 입장 시 전송할 환영메시지의 내용을 입력하세요.
const byeChannelComment = "안녕히가세요.✨" // 퇴장 시 전송할 메시지의 내용을 입력하세요.
const roleName = "게스트" // 입장 시 지급 할 역할의 이름을 적어주세요.

client.on("ready", () => {
  console.log("켰다.")
  client.user.setPresence({ activity: { name: "24시간 서버관리중[skk[/help]]" }, status: "online" })
})

client.on("guildMemberAdd", (member) => {
  const guild = member.guild
  const newUser = member.user
  const welcomeChannel = guild.channels.cache.find((channel) => channel.name == welcomeChannelName)

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
  member.roles.add(guild.roles.cache.find((role) => role.name === roleName).id)
})

client.on("guildMemberRemove", (member) => {
  const guild = member.guild
  const deleteUser = member.user
  const byeChannel = guild.channels.cache.find((channel) => channel.name == byeChannelName)

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
})

client.on("message", (message) => {
  if (message.author.bot) return

  if (message.content == "ping") {
    return message.reply("pong")
  }

  if (message.content == "embed") {
    let img = "https://yt3.ggpht.com/yti/ANoDKi4NXEnUEqMvxq7KTqShApHlqms2VCvz39HGACbaPA=s88-c-k-c0x00ffffff-no-rj-mo"
    let embed = new Discord.MessageEmbed()
      .setTitle("타이틀")
      .setURL("http://www.naver.com")
      .setAuthor("성클킹", img, "https://www.youtube.com/channel/UCd0LYIqTfFmoJcKhBfzZmYw")
      .setThumbnail(img)
      .addField("봇개발자", "성클킹")
      .addField("만든봇들", "꿀벌,성클킹봇", true)
      .addField("Inline field title", "Some value here", true)
      .addField("Inline field title", "Some value here", true)
      .addField("Inline field title", "Some value here1\nSome value here2\nSome value here3\n")
      .setTimestamp()
      .setFooter("성클킹이 만듬", img)

    message.channel.send(embed)
  } else if (message.content == "/help") {
    let helpImg = "https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png"
    let commandList = [
      { name: "/help", desc: "help" },
      { name: "ping", desc: "현재 핑 상태" },
      { name: "embed", desc: "embed 예제1" },
      { name: "!전체공지", desc: "dm으로 전체 공지 보내기" },
      { name: "!전체공지2", desc: "dm으로 전체 embed 형식으로 공지 보내기" },
      { name: "!청소", desc: "텍스트 지움" },
      { name: "!초대코드", desc: "해당 채널의 초대 코드 표기" },
      { name: "!초대코드2", desc: "봇이 들어가있는 모든 채널의 초대 코드 표기" },
    ]
    let commandStr = ""
    let embed = new Discord.MessageEmbed().setAuthor("Help of 성클킹 BOT", helpImg).setColor("#186de6").setFooter(`성클킹 BOT ❤️`).setTimestamp()

    commandList.forEach((x) => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`
    })

    embed.addField("Commands: ", commandStr)

    message.channel.send(embed)
  } else if (message.content == "!초대코드2") {
    client.guilds.cache.array().forEach((x) => {
      x.channels.cache
        .find((x) => x.type == "text")
        .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then((invite) => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if (err.code == 50013) {
            message.channel.send(`**${x.channels.cache.find((x) => x.type == "text").guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
          }
        })
    })
  } else if (message.content == "!초대코드") {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }
    message.guild.channels.cache
      .get(message.channel.id)
      .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then((invite) => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if (err.code == 50013) {
          message.channel.send(`**${message.guild.channels.cache.get(message.channel.id).guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
        }
      })
  } else if (message.content.startsWith("!전체공지2")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지2".length)
      let embed = new Discord.MessageEmbed().setAuthor("공지 of 성클킹 BOT").setColor("#186de6").setFooter(`성클킹 BOT ❤️`).setTimestamp()

      embed.addField("공지: ", contents)

      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(embed)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!전체공지")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지".length)
      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(`<@${message.author.id}> ${contents}`)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!청소")) {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }

    if (message.channel.type != "dm" && checkPermission(message)) return

    var clearLine = message.content.slice("!청소 ".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 3000 }))
        })
        .catch(console.error)
    }
  }
})

function checkPermission(message) {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
    return true
  } else {
    return false
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str
  limitLen -= tmp.length

  for (let i = 0; i < limitLen; i++) {
    tmp += " "
  }

  return tmp
}
client.on('messageUpdate', async message => {
  message.channel.send(`<@!${message.author.id}> 님이 \`${message.content}\` 을(를) 수정하셨습니다.`)
}) 
//뮤트

//뮤트

let Cooltime_Mute = 2 * 1000 //밀리세컨드 
// 2초내에 칠 시 뮤트
let User_Mute_Object = {}
client.on('message', async message => {
  let MuteRole = client.guilds.cache.get(message.guild.id).roles.cache.find(r => r.name === "Muted").id
  if (message.author.bot || !message.guild) return
  MuteRole = message.guild.roles.cache.find(r => r.id == MuteRole)
  const M_Author = message.author
  if (!message.member.hasPermission('ADMINISTRATOR')) {
    let Author_Object = User_Mute_Object[M_Author.id]
    if (!Author_Object) {
      User_Mute_Object[M_Author.id] = {
        time: 0,
        interval: null,
        muted: false
      }
    } else {
      if (Author_Object.interval != null) {
        if (Cooltime_Mute >= Author_Object.time && !Author_Object.muted) {
          message.member.roles.add(MuteRole)
          Author_Object.muted = true
          message.reply(`[사죄하는 곳가서 사죄하세요]전 채팅과의 시간차 ${Author_Object.time}ms`)
        }
        clearInterval(Author_Object.interval)
        Author_Object.interval = null
      } else if (!Author_Object.muted) {
        Author_Object.interval = setInterval(() => {
          Author_Object.time++
        }, 1)
      }
      Author_Object.time = 0
    }
  }
  if (message.member.hasPermission('ADMINISTRATOR') && /!언뮤트 <@!?(\d{17,19})>/g.test(message.content)) {
    const Mention_member = message.mentions.members.first()
    Mention_member.roles.remove(MuteRole)
    User_Mute_Object[Mention_member.id].muted = false
    User_Mute_Object[Mention_member.id].time = 0
    message.channel.send(`${Mention_member}, 해방됨`)
  }
})
//아바타 확인

module.exports = {
  name: 'avatar',
  description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
  execute(message) {
      if (!message.mentions.users.size) {
          return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
      }

      const avatarList = message.mentions.users.map(user => {
          return `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`;
      });

      message.channel.send(avatarList);
  },
};

if (message.content === '!코로나') {
  let url = "https://apiv2.corona-live.com/stats.json"
  request(url, (error, response, body) => {
      let overview = JSON.parse(response.body).overview;
      overview = {
          total_confirmed_person: overview.confirmed[0], // 총 확진자수
          yesterday_confirmed_person: overview.confirmed[1], // 어제 확진자수
  
          current_confirmed_person: overview.current[0], // 현재 확진자수
          current_confirmed_person_diff: overview.current[1], // diff(어제 이 시간대 확진자 수 - 현재 이 시간대 확진자 수)
      }
  
      let embed = new Discord.MessageEmbed()
      embed.setTitle('코로나 라이브 홈페이지')
      embed.setURL('https://corona-live.com')
      embed.setColor('#FF8000')
      embed.setDescription('코로나 정보입니다')
      embed.addField(`대한민국 총 확진자 수`, `${overview.total_confirmed_person}명`, true)
      embed.addField(`어제 확진자 수`, overview.yesterday_confirmed_person + `명`, true)
      embed.addField(`오늘 확진자 수`, overview.current_confirmed_person + `명`, true)
      // embed.addField(`오늘 어제지금시간   -   현재지금시간의 확진자`, overview.current_confirmed_person_diff + `명`, true)
      message.channel.send(embed)
  
    })
  }
  
module.exports = {
  name: "복권",
  description: "play a game of rock, paper and scissors",
  run: async(client, message, args) => {
      let embed = new discord.MessageEmbed()
      .setTitle("복권 게임")
      .setDescription("복권 놀이! 이것은 복권을  놀이 입니다. (가위바위보기능을 이용한겁니다. 가위바위보기능이랑 동일합니다.)")
      .setTimestamp()
      let msg = await message.channel.send(embed)
      await msg.react(":dollar:")
      await msg.react(":oncoming_police_car:")
      await msg.react(":credit_card:")

      const filter = (reaction, user) => {
          return [':dollar:', ':oncoming_police_car:', ':credit_card:'].includes(reaction.emoji.name) && user.id === message.author.id;
      }

      const choices = [':dollar:', ':oncoming_police_car:', ':credit_card:']
      const me = choices[Math.floor(Math.random() * choices.length)]
      msg.awaitReactions(filter, {max:1, time: 60000, error: ["time"]}).then(
          async(collected) => {
              const reaction = collected.first()
              let result = new discord.MessageEmbed()
              .setTitle("결과")
              .addField("당신의 선택", `${reaction.emoji.name}`)
              .addField("내 선택", `${me}`)
          await msg.edit(result)
              if ((me === ":dollar:" && reaction.emoji.name === ":oncoming_police_car:") ||
              (me === ":credit_card:" && reaction.emoji.name === ":dollar:") ||
              (me === ":oncoming_police_car:" && reaction.emoji.name === ":credit_card:")) {
                  message.reply("복권 날라가셨네요 ㅋㅋ");
          } else if (me === reaction.emoji.name) {
              return message.reply("네 복권 날리셨네요 ㅋㅋ");
          } else {
              return message.reply("님이 이겨서 복권을 가지셨어요");
          }
      })
      .catch(collected => {
              message.reply('제 시간에 응답하지 않았으므로 처리가 취소되었습니다!');
          })
}
}
client.login(token);