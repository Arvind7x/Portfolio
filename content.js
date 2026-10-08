/* HOW TO ADD YOUR ART — 30 seconds per piece:
   1. Drop your image into the assets/ folder (e.g. assets/my-meme-1.png)
   2. In works below, set  img: "assets/my-meme-1.png"  on any piece
   3. For your photo: set profile photo: "assets/me.jpg"
   Supported: .png .jpg .webp .gif — keep each under ~500KB for speed.
   Edit easily in admin.html (no code needed) or edit here directly. */
window.SITE_CONTENT = {
  profile: {
    alias: "0xVOID",
    hello: "Hey, I'm 0xVOID.",
    summary: "I test crypto products, help look after communities, and make art and memes. Nothing fancy — here's some of my work below.",
    roles: ["Tester", "Community manager", "Artist"],
    photo: "", // e.g. "assets/me.jpg" — shows next to hero. Leave "" to hide.
    x: "https://x.com/yourhandle",
    xHandle: "@yourhandle",
    discord: "yourhandle",
    discordNote: "Fastest reply — usually within a day."
  },
  about: {
    title: "A bit about me",
    body: "I've been around a few crypto projects doing testnets, hanging out in Discord and Telegram helping people, and making art when something needs a visual. I like small teams where I can just be useful.",
    points: [
      "Testing — clicking through testnets, noting what breaks, sending clear notes.",
      "Community — answering questions, keeping chat tidy, helping new people settle in.",
      "Art — memes, headers, stickers, small PFP bits. Casual stuff people repost."
    ],
    tools: ["Discord", "Telegram", "X", "Figma", "Notion"]
  },
  // PAGE 1 — projects you've worked with. Add as many as you want in admin.
  // x = project's X link, role = what you did there, img = project logo/picture in assets/ (e.g. "assets/movement.png").
  projects: [
    { id: "p1", name: "Movement", x: "https://x.com/movementlabsxyz", role: "Community + testing", img: "" },
    { id: "p2", name: "Analog", x: "https://x.com/analog", role: "Tester + art", img: "" },
    { id: "p3", name: "Pepe Brigade", x: "https://x.com/yourhandle", role: "Discord mod", img: "" },
    { id: "p4", name: "OrbitSwap", x: "https://x.com/yourhandle", role: "Testnet QA", img: "" }
  ],
  works: [
    {
      id: "w1", cat: "art", title: "Raid poster — Pepe Brigade",
      note: "Poster made for a community raid night.",
      desc: "A simple poster for a Friday raid. Made in one evening, used as the announcement image in Discord.",
      look: "lime", letter: "P", tall: true, img: "", featured: true
    },
    {
      id: "w2", cat: "testing", title: "OrbitSwap test notes",
      note: "Swap + bridge walkthrough with notes.",
      desc: "Went through the swap and bridge on testnet, recorded what broke and sent steps so devs could redo it.",
      look: "ink", letter: "O", tall: false, img: "", featured: true
    },
    {
      id: "w3", cat: "community", title: "Discord tidy-up — 800 members",
      note: "Roles, tickets and FAQ setup.",
      desc: "Helped set up basic roles, a ticket channel and a short FAQ. Mostly just stayed active and answered questions.",
      look: "paper", letter: "D", tall: false, img: "", featured: true
    },
    {
      id: "w4", cat: "art", title: "Sticker pack v2",
      note: "12 stickers the chat still uses.",
      desc: "Small set of reaction stickers drawn from community jokes. Nothing polished, just stuff people liked.",
      look: "plum", letter: "S", tall: true, img: "", featured: true
    },
    {
      id: "w5", cat: "testing", title: "GhostChain faucet notes",
      note: "Faucet + staking edge cases.",
      desc: "Tested faucet claims and staking flows, wrote down edge cases with screenshots.",
      look: "mist", letter: "G", tall: false, img: "", featured: true
    },
    {
      id: "w6", cat: "art", title: "Trait sheet — DegenDraws",
      note: "A few traits for an NFT test collection.",
      desc: "Drew some traits to help a small collection get to mint. Rough, fun style.",
      look: "peach", letter: "D", tall: false, img: "", featured: true
    },
    {
      id: "w7", cat: "community", title: "Raid hours — weekly",
      note: "Ran a simple weekly raid routine.",
      desc: "Picked a time, posted the target, kept count. Kept it light so people showed up.",
      look: "mint", letter: "R", tall: true, img: ""
    },
    {
      id: "w8", cat: "art", title: "How-to meme — staking",
      note: "Explainer meme that cut down questions.",
      desc: "One image explaining staking steps. Posted it in support channel, fewer repeat questions after.",
      look: "ink", letter: "H", tall: false, img: ""
    },
    {
      id: "w9", cat: "testing", title: "Mint flow check",
      note: "Wallet + mint walkthrough video.",
      desc: "Recorded the mint flow twice, noted where it got stuck on mobile. Short Loom + written steps.",
      look: "paper", letter: "M", tall: false, img: ""
    }
  ]
};
