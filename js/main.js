// Function to hide the loader 
function hideloader() {
      document.getElementById('loader').style.display = 'none';
  }
  // Function to define innerHTML for fetched data 
  function showFetchedData(data) {
      document.getElementById("fetchedData").innerHTML = data;
  }
  // Function to define innerHTML for wordMapData
  function showWordMapData(data) {
      document.getElementById("wordMapData").innerHTML = JSON.stringify(data);
  }
  // Function to define innerHTML for topTenWord
  function showTopTenWord(data) {
      document.getElementById("topTenWord").innerHTML = JSON.stringify(data);
  }
  // Function to define innerHTML for topTenWordDetails
  function showTopTenWordDetails(data) {
      document.getElementById("topTenWordDetails").innerHTML = JSON.stringify(data);
  }
  // Function to define innerHTML for topTenWordJSONFormat
  function showTopTenWordJSONFormat(data) {
      document.getElementById("topTenWordJSONFormat").innerHTML = JSON.stringify(data);
  }
  
  
  (async () => {
      // start the fetch and obtain a reader
      let response = await fetch('https://norvig.com/big.txt');
  
      const reader = response.body.getReader();
  
      // get total length
      const contentLength = +response.headers.get('Content-Length');
  
      // read the data
      let receivedLength = 0; // received that many bytes at the moment
      let chunks = []; // array of received binary chunks (comprises the body)
      while (true) {
          const {
              done,
              value
          } = await reader.read();
  
          if (done) {
              break;
          }
  
          chunks.push(value);
          receivedLength += value.length;
  
          console.log(`Received ${receivedLength} of ${contentLength}`)
      }
  
      //concatenate chunks into single Uint8Array
      let chunksAll = new Uint8Array(receivedLength); // (4.1)
      let position = 0;
      for (let chunk of chunks) {
          chunksAll.set(chunk, position); // (4.2)
          position += chunk.length;
      }
  
      //decode into a string
      let result = new TextDecoder("utf-8").decode(chunksAll);
      //console.log(result);
      // We're done!
      if (result) {
          hideloader();
      }
      showFetchedData(result);
  
      function createWordMap(wordsArray) {
  
          // create map for word counts
          var wordsMap = {};
   
          wordsArray.forEach(function(key) {
              if (wordsMap.hasOwnProperty(key)) {
                  wordsMap[key]++;
              } else {
                  wordsMap[key] = 1;
              }
          });
  
          return wordsMap;
  
      };
   
      var wordsMap = createWordMap(result.replace(/[^a-zA-Z ]/g, "").split(" ").filter(function(i) {
          return i != "" && i.length != 1
      }));
      console.log(wordsMap);
      showWordMapData(wordsMap)
  
      // Create items array for sorting
      var items = Object.keys(wordsMap).map(function(key) {
          return {
              "word": key,
              "count": wordsMap[key]
          };
      });
  
      // Sort the array based on the second element
      items.sort(function(first, second) {
          return second["count"] - first["count"];
      });
  
      // Create topTenWordsarray with only the first 10 items
      let topTenWords = items.slice(0, 10);
  
      showTopTenWord(topTenWords);
      var dictURL = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=';
      Promise.all(topTenWords.map(u => fetch(dictURL + u["word"]))).then(responses =>
          Promise.all(responses.map(res => res.json()))
      ).then(texts => {
          console.log(texts);
          showTopTenWordDetails(texts);
          let topTenWordJSONFormat = createTopTenJSON(texts);
          showTopTenWordJSONFormat(topTenWordJSONFormat);
          console.log(topTenWordJSONFormat);
  
      });
  
      function createTopTenJSON(topTenData) {
          let requiredFormat = []
          topTenData.forEach(function(eachData, index) {
              let data = {}
              data["Word"] = eachData.def[0] ? eachData.def[0].text : '';
              data["Output"] = {}
              data["Output"]["Pos"] = eachData.def[0] ? eachData.def[0].pos : '';
              data["Output"]["Count"] = topTenWords[index]['count']
              requiredFormat.push(data);
          })
          return requiredFormat
      }
  
  
      console.timeLog('map');
  })()