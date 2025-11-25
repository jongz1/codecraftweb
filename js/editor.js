// js/editor.js
document.addEventListener("DOMContentLoaded", () => {

    // DEBUG: confirma que el archivo se cargó
    console.log("editor.js cargado");

    const btn = document.getElementById("btnEjecutar");
    const textarea = document.getElementById("editorCodigo");
    const iframe = document.getElementById("editorSalida");

    if (!btn || !textarea || !iframe) {
        console.error("editor.js: faltan elementos (btnEjecutar, editorCodigo, editorSalida).");
        return;
    }

    btn.addEventListener("click", () => {
        const code = textarea.value || "";

        // Crear documento limpio en el iframe
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(`<!doctype html><html><head><meta charset="utf-8"></head><body style="font-family:monospace;margin:0;padding:8px;"><div id="consola"></div></body></html>`);
        doc.close();

        // Funcion para serializar valores
        function safeStringify(v) {
            try {
                if (typeof v === "string") return v;
                return JSON.stringify(v, null, 2);
            } catch (e) {
                try { return String(v); } catch(_) { return "[object]"; }
            }
        }

        // Inyectar script de inicialización (redefine console.log / console.error)
        const initScript = doc.createElement("script");
        initScript.type = "text/javascript";
        initScript.textContent = `
            (function(){
                const consola = document.getElementById('consola');
                function writeLine(text, cls){
                    const d = document.createElement('div');
                    if (cls) d.className = cls;
                    d.textContent = text;
                    consola.appendChild(d);
                }
                window._safePrint = function(){
                    const args = Array.prototype.slice.call(arguments);
                    const parts = args.map(function(a){
                        try {
                            if (typeof a === 'string') return a;
                            return JSON.stringify(a, null, 2);
                        } catch(e) {
                            try { return String(a); } catch(_) { return '[object]'; }
                        }
                    });
                    writeLine(parts.join(' '));
                };
                console.log = function(){ window._safePrint.apply(null, arguments); };
                console.error = function(){ var args = Array.prototype.slice.call(arguments); writeLine('Error: ' + args.join(' '), 'err'); };
                window.addEventListener('error', function(e){
                    writeLine('Error: ' + (e && e.message ? e.message : e.toString()), 'err');
                });
            })();
        `;
        doc.body.appendChild(initScript);

        // Inyectar estilos mínimos para errores/console
        const style = doc.createElement("style");
        style.textContent = `
            .err { color: #c53030; font-weight: 700; }
            #consola { white-space: pre-wrap; font-family: monospace; font-size: 13px; }
        `;
        doc.head.appendChild(style);

        // Inyectar el script del usuario **usando textContent** (seguro frente a </script>)
        const userScript = doc.createElement("script");
        userScript.type = "text/javascript";
        userScript.textContent = `
            try {
                ${code}
            } catch (err) {
                console.error(err && err.message ? err.message : err);
            }
        `;
        doc.body.appendChild(userScript);

    });

});
