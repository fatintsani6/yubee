document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("data.json?t=" + new Date().getTime());
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        const escHtml = (s) => {
            const text = String(s ?? '').replace(/<[^>]*>/g, '');
            const d = document.createElement('div');
            d.textContent = text;
            return d.innerHTML;
        };

        // ── PIN Screen ──
        if (data.pin_screen) {
            const pe = document.querySelector('.pin-eyebrow');
            if (pe) pe.textContent = data.pin_screen.eyebrow;

            const pt = document.querySelector('.pin-title');
            if (pt) pt.textContent = data.pin_screen.title;

            const ph = document.querySelector('.pin-hint');
            if (ph) ph.textContent = data.pin_screen.subtitle;

            const pb = document.querySelector('.pin-submit span');
            if (pb) pb.textContent = data.pin_screen.button;

            const perr = document.getElementById('pinError');
            if (perr && data.pin_screen.error) {
                const textNodes = Array.from(perr.childNodes).filter(n => n.nodeType === 3);
                if (textNodes.length) {
                    textNodes.forEach(n => n.textContent = '');
                }
                perr.appendChild(document.createTextNode('\n                    ' + data.pin_screen.error + '\n                '));
            }
        }

        // Update PIN in CONFIG
        if (data.pin && window.CONFIG && window.CONFIG.pin) {
            window.CONFIG.pin.code = String(data.pin);
        }

        // ── Navbar ──
        if (data.navbar_text) {
            const marks = document.querySelectorAll('.mark span');
            marks.forEach(m => m.textContent = data.navbar_text);
            const mark2 = document.querySelector('footer .mark2');
            if (mark2) mark2.textContent = data.navbar_text;
        }

        // ── Hero ──
        if (data.hero) {
            const eyebrow = document.getElementById('heroEyebrow');
            if (eyebrow) eyebrow.textContent = data.hero.eyebrow;

            const name = document.querySelector('.hero-name');
            if (name) name.textContent = data.hero.name;

            const sub = document.querySelector('.hero-sub');
            if (sub) sub.textContent = data.hero.sub;

            const line = document.querySelector('.hero-line');
            if (line) line.textContent = data.hero.message;

            const btn = document.querySelector('.cta-txt');
            if (btn && data.hero.button) btn.textContent = data.hero.button;
        }

        // ── Gallery Header ──
        if (data.gallery_header) {
            const galSection = document.getElementById('gallery');
            if (galSection) {
                const ge = galSection.querySelector('.section-head .eyebrow');
                if (ge) ge.textContent = data.gallery_header.eyebrow;
                const gt = galSection.querySelector('.section-head h2');
                if (gt) gt.innerHTML = escHtml(data.gallery_header.title).replace(/\b(\w+)$/, '<em>$1</em>');
                const gd = galSection.querySelector('.section-head p:not(.memory-counter):not(.eyebrow)');
                if (gd) gd.textContent = data.gallery_header.desc;
            }
        }

        // ── Gallery Items ──
        if (data.gallery && Array.isArray(data.gallery)) {
            const pf = document.getElementById('pressField');
            if (pf) {
                const cards = pf.querySelectorAll('.press-card');
                data.gallery.forEach((g, i) => {
                    const card = cards[i];
                    if (card) {
                        const img = card.querySelector('img');
                        if (img && g.photo) {
                            img.src = g.photo.replace(/^\/?assets/, './assets');
                        }
                        const cap = card.querySelector('.cap');
                        if (cap) cap.textContent = g.caption;
                    }
                });
            }
        }

        // ── Notes Header ──
        if (data.notes_header) {
            const notesSection = document.getElementById('reasons');
            if (notesSection) {
                const ne = notesSection.querySelector('.section-head .eyebrow');
                if (ne) ne.textContent = data.notes_header.eyebrow;
                const nt = notesSection.querySelector('.section-head h2');
                if (nt) nt.innerHTML = escHtml(data.notes_header.title).replace(/\b(\w+)$/, '<em>$1</em>');
                const nd = notesSection.querySelector('.section-head p:not(.eyebrow)');
                if (nd) nd.textContent = data.notes_header.desc;
            }
        }

        // ── Notes Items ──
        if (data.notes && Array.isArray(data.notes)) {
            const fn = document.querySelector('.field-notes');
            if (fn) {
                const notes = fn.querySelectorAll('.note');
                data.notes.forEach((n, i) => {
                    const note = notes[i];
                    if (note) {
                        const title = note.querySelector('h3');
                        if (title) title.textContent = n.title;
                        const text = note.querySelector('p');
                        if (text) text.textContent = n.text;
                    }
                });
            }
        }

        // ── Letter ──
        if (data.letter) {
            const letSection = document.getElementById('message');
            if (letSection) {
                const le = letSection.querySelector('.section-head .eyebrow');
                if (le) le.textContent = data.letter.eyebrow;
                const lt = letSection.querySelector('.section-head h2');
                if (lt) lt.innerHTML = escHtml(data.letter.title).replace(/\b(\w+)$/, '<em>$1</em>');

                const salutation = letSection.querySelector('.letter-salutation');
                if (salutation) salutation.textContent = data.letter.salutation;

                const lc = letSection.querySelector('.letter');
                if (lc && data.letter.paragraphs) {
                    const oldPs = lc.querySelectorAll('p');
                    oldPs.forEach(p => p.remove());

                    const signDiv = lc.querySelector('.letter-sign');

                    data.letter.paragraphs.forEach((p, idx) => {
                        const pp = document.createElement('p');
                        if (idx === 0) {
                            pp.innerHTML = `<span class="letter-drop">${p.charAt(0)}</span>${p.slice(1)}`;
                        } else {
                            pp.textContent = p;
                        }
                        if (signDiv) {
                            lc.insertBefore(pp, signDiv);
                        } else {
                            lc.appendChild(pp);
                        }
                    });
                }

                const signWh = letSection.querySelector('.who');
                if (signWh) signWh.textContent = data.letter.sign_who || data.letter.signoff_who;

                const signFrom = letSection.querySelector('.from');
                if (signFrom) signFrom.textContent = data.letter.sign_from || data.letter.signoff_from;
            }
        }

        // ── Music ──
        if (data.music) {
            const m = data.music;
            const audioEl = document.getElementById('audioEl');
            if (audioEl && m.song) {
                audioEl.src = m.song.replace(/^\/?assets/, './assets');
                if (m.start_time) {
                    audioEl.dataset.startTime = m.start_time;
                }
            }

            const cover = document.getElementById('trackCover');
            if (cover && m.cover) {
                cover.src = m.cover.replace(/^\/?assets/, './assets');
            }

            const tt = document.querySelector('.track-title');
            if (tt) tt.textContent = m.title;

            const ta = document.querySelector('.track-sub');
            if (ta) ta.textContent = m.artist;

            const pSection = document.getElementById('playlist');
            if (pSection) {
                const pe = pSection.querySelector('.section-head .eyebrow');
                if (pe && m.eyebrow) pe.textContent = m.eyebrow;
                const pt = pSection.querySelector('.section-head h2');
                if (pt && m.header_title) pt.innerHTML = escHtml(m.header_title).replace(/\b(\w+)$/, '<em>$1</em>');
                const pd = pSection.querySelector('.section-head p:not(.eyebrow)');
                if (pd && m.desc) pd.textContent = m.desc;
            }
        }

        // ── Countdown ──
        if (data.countdown) {
            const cSection = document.getElementById('countdown');
            if (cSection) {
                const ce = cSection.querySelector('.section-head .eyebrow');
                if (ce) ce.textContent = data.countdown.eyebrow;
                const ct = cSection.querySelector('.section-head h2');
                if (ct) ct.innerHTML = escHtml(data.countdown.title).replace(/\b(\w+)$/, '<em>$1</em>');

                if (data.countdown.date && window.CONFIG && window.CONFIG.countdown) {
                    window.CONFIG.countdown.exactDate = new Date(data.countdown.date);
                }
            }
        }

        // ── Finale ──
        if (data.finale) {
            const fSection = document.getElementById('finale');
            if (fSection) {
                const fe = fSection.querySelector('.eyebrow');
                if (fe) fe.textContent = data.finale.eyebrow;
                const ft = fSection.querySelector('h2');
                if (ft) ft.innerHTML = escHtml(data.finale.title).replace(/\b(\w+)$/, '<em>$1</em>');
                const fq = fSection.querySelector('.quote');
                if (fq) fq.textContent = data.finale.quote;
                const fw = fSection.querySelector('.wish');
                if (fw) fw.textContent = data.finale.wish;
            }

            const foot = document.querySelector('footer p');
            if (foot) foot.textContent = data.finale.footer;
        }

    } catch (err) {
        console.error("Failed to load data.json:", err);
    }
});
