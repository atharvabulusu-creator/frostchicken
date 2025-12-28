(function(){
    const SEASONS = {
        winter: {
            id: 'winter',
            label: 'Winter',
            char: '❄',
            freq: 300,
            size: [14, 28],
            duration: [3, 8],
            drift: [-100, 100],
            zIndex: -1
        },
        spring: {
            id: 'spring',
            label: 'Spring',
            char: '🌸',
            freq: 260,
            size: [16, 34],
            duration: [4, 9],
            drift: [-140, 140],
            zIndex: -1
        },
        summer: {
            id: 'summer',
            label: 'Summer',
            char: '☀️',
            freq: 900,
            size: [20, 44],
            duration: [6, 12],
            drift: [-50, 50],
            zIndex: -1
        },
        autumn: {
            id: 'autumn',
            label: 'Autumn',
            char: '🍂',
            freq: 320,
            size: [16, 32],
            duration: [4, 9],
            drift: [-200, 200],
            zIndex: -1
        }
    };

    let intervalId = null;
    let activeSeason = localStorage.getItem('fc_active_season') || 'winter';
    let styleInjected = false;

    function injectStyles(){
        if(styleInjected) return;
        styleInjected = true;
        const css = `
        .season-item {
            position: fixed;
            top: -20px;
            pointer-events: none;
            user-select: none;
            text-shadow: 0 0 5px rgba(0,0,0,0.2);
            animation: fc-fall linear forwards;
            transform-origin: center;
        }
        .season-winter { color: #ffffff; }
        .season-spring { color: #ff7fc7; }
        .season-summer { color: #ffd54a; }
        .season-autumn { color: #d97706; }
        @keyframes fc-fall {
            to { transform: translateY(100vh) rotateZ(360deg) translateX(var(--drift,0)); }
        }
        /* Body backgrounds per season (use important to override inline styles) */
        body.fc-season-winter { background: #ADD8E6 !important; }
        body.fc-season-spring { background: linear-gradient(180deg, #c5f6ffff, #defaffff) !important; }
        body.fc-season-summer { background: linear-gradient(180deg, #e8fffdff, #FFF7E0) !important; }
        body.fc-season-autumn { background: linear-gradient(180deg, #fffde6ff, #FFE6D1) !important; }
        /* picker UI removed - seasons are controlled via code */
        `;
        const s = document.createElement('style');
        s.setAttribute('data-generated','seasons');
        s.textContent = css;
        document.head.appendChild(s);
    }

    function rand(min,max){ return Math.random()*(max-min)+min; }

    function clearExistingItems(){
        const els = document.querySelectorAll('.season-item');
        els.forEach(e=>e.remove());
    }

    function stopSeason(){
        if(intervalId) clearInterval(intervalId);
        intervalId = null;
        clearExistingItems();
    }

    function startSeason(name){
        stopSeason();
        const cfg = SEASONS[name] || SEASONS.winter;
        activeSeason = cfg.id;
        localStorage.setItem('fc_active_season', activeSeason);
        intervalId = setInterval(()=>createItem(cfg), cfg.freq);
        for(let i=0;i<6;i++) setTimeout(()=>createItem(cfg), i*150);
        applyBodySeasonClass(activeSeason);
    }

    function createItem(cfg){
        const el = document.createElement('div');
        el.className = 'season-item season-'+cfg.id;
        el.textContent = cfg.char;
        const size = Math.round(rand(cfg.size[0], cfg.size[1]));
        el.style.fontSize = size+'px';
        const left = Math.round(Math.random()*window.innerWidth);
        el.style.left = left+'px';
        const duration = rand(cfg.duration[0], cfg.duration[1]);
        el.style.animationDuration = duration+'s';
        const drift = Math.round(rand(cfg.drift[0], cfg.drift[1]));
        el.style.setProperty('--drift', drift+'px');
        el.style.zIndex = cfg.zIndex;
        document.body.appendChild(el);
        setTimeout(()=>{ try{ el.remove(); }catch(e){} }, duration*1000 + 200);
    }

    function init(){
        injectStyles();
        startSeason(activeSeason);
        applyBodySeasonClass(activeSeason);
        window.addEventListener('resize', ()=>{});
    }

    function applyBodySeasonClass(name){
        document.body.classList.remove('fc-season-winter','fc-season-spring','fc-season-summer','fc-season-autumn');
        document.body.classList.add('fc-season-'+name);
        console.log('Applied class fc-season-'+name, 'Body now has:', document.body.className);
    }

    window.FrostChickenSeasons = {
        setSeason: function(name){
            startSeason(name);
            setTimeout(()=>applyBodySeasonClass(name), 5);
        },
        getSeason: ()=> activeSeason,
        stop: stopSeason
    };

    if(document.readyState === 'complete' || document.readyState === 'interactive') init();
    else document.addEventListener('DOMContentLoaded', init);

})();
