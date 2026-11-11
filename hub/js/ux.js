(() => {

    function initUploadUX() {

        const input = document.getElementById("torrentFile");
        const dropZone = document.getElementById("dropZone");
        const selectedFile = document.getElementById("selectedFile");
        const fileName = document.getElementById("fileName");
        const fileSize = document.getElementById("fileSize");

        if (!input || !dropZone || dropZone.dataset.uxReady) return;

        dropZone.dataset.uxReady = "true";

        const iconBox = dropZone.querySelector("div.w-16");

        if (!iconBox) return;

        console.log("[OMDA] Upload UX iniciado");

        function formatSize(bytes) {
            if (bytes < 1024 * 1024) {
                return Math.max(1, Math.round(bytes / 1024)) + " KB";
            }

            return (bytes / 1024 / 1024).toFixed(2) + " MB";
        }

        function iconPulse() {

            iconBox.classList.add(
                "-translate-y-2",
                "scale-110",
                "shadow-lg"
            );

            setTimeout(() => {

                iconBox.classList.remove(
                    "-translate-y-2",
                    "scale-110",
                    "shadow-lg"
                );

            }, 220);
        }

        dropZone.addEventListener("mouseenter", () => {

            iconBox.classList.add(
                "-translate-y-1",
                "scale-105"
            );

        });

        dropZone.addEventListener("mouseleave", () => {

            iconBox.classList.remove(
                "-translate-y-1",
                "scale-105"
            );

        });

        dropZone.addEventListener("click", event => {

            if (event.target.closest("#removeFile")) return;

            iconPulse();

            input.click();

        });

        input.addEventListener("change", () => {

            const file = input.files?.[0];

            if (!file) return;

            console.log("[OMDA] Arquivo:", file.name);
            console.log("[OMDA] Tamanho:", formatSize(file.size));

            if (!file.name.toLowerCase().endsWith(".torrent")) {

                console.warn("[OMDA] Arquivo inválido");

                alert("Selecione um arquivo .torrent");

                input.value = "";
                return;
            }

            fileName.textContent = file.name;
            fileSize.textContent = formatSize(file.size);

            selectedFile.classList.remove("hidden");

            // ÍCONE → estado carregado
            iconBox.classList.remove(
                "bg-[#5864be]/10",
                "border-[#5864be]/20",
                "text-[#5864be]"
            );

            iconBox.classList.add(
                "bg-green-500/10",
                "border-green-500/30"
            );

            const icon = iconBox.querySelector("svg");

            icon?.classList.remove("text-[#5864be]");
            icon?.classList.add(
                "text-green-500",
                "scale-125"
            );

            setTimeout(() => {
                icon?.classList.remove("scale-125");
            }, 250);

            // DROPZONE
            dropZone.classList.remove("border-zinc-300");

            dropZone.classList.add(
                "border-green-500",
                "bg-green-50"
            );

            // BARRA
            const bar = document.createElement("div");

            bar.className =
                "absolute left-0 bottom-0 h-1 bg-green-500 rounded-full";

            bar.style.width = "0%";
            bar.style.transition = "width .45s ease";

            dropZone.appendChild(bar);

            requestAnimationFrame(() => {
                bar.style.width = "100%";
            });

            setTimeout(() => bar.remove(), 500);

            console.log("[OMDA] ✓ Torrent carregado");
        });

        const remove = document.getElementById("removeFile");

        remove?.addEventListener("click", event => {

            event.stopPropagation();

            input.value = "";

            selectedFile.classList.add("hidden");

            dropZone.classList.remove(
                "border-green-500",
                "bg-green-50"
            );

            dropZone.classList.add("border-zinc-300");

            iconBox.classList.remove(
                "bg-green-500/10",
                "border-green-500/30"
            );

            iconBox.classList.add(
                "bg-[#5864be]/10",
                "border-[#5864be]/20"
            );

            const icon = iconBox.querySelector("svg");

            icon?.classList.remove(
                "text-green-500",
                "scale-125"
            );

            icon?.classList.add("text-[#5864be]");

            console.log("[OMDA] Arquivo removido");

        });

    }

    initUploadUX();

    new MutationObserver(initUploadUX)
        .observe(document.body, {
            childList: true,
            subtree: true
        });

})();