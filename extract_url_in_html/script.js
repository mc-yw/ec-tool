(() => {
    "use stricts"

    document.getElementById("run").addEventListener("click", () => {
        try {
            let src = document.getElementById("text").value
            let parsed_obj = getParsedObject(src)

            let type_csv = document.getElementById("type:csv").checked
            let dst = {}
            let mode = document.getElementById("select").value

            if (mode === '1') {
                dst = getHrefs(parsed_obj)
            } else if (mode === '2') {
                dst = getImgSrcs(parsed_obj)
            }

            if (type_csv) {
                document.getElementById("result").value = putList(dst)
            } else {
                document.getElementById("result").value = JSON.stringify(dst)
            }

        } catch (e) {
            alert(e)
        }
    })

    function getParsedObject(str_html) {
        let parser = new DOMParser()
        let doc = parser.parseFromString(str_html, "text/html")
        return doc
    }

    function getHrefs(doc) {
        return Array.from(
            doc.links,
            (e) => {
                return e.getAttribute("href").toString()
            }
        )
    }

    function getImgSrcs(doc) {
        return Array.from(
            doc.images,
            (e) => {
                return e.getAttribute("src").toString()
            }
        )
    }

    function putList(src) {
        var result = ""
        src.forEach((e) => {
            result += e + "\n"
        })
        return result
    }
})()
