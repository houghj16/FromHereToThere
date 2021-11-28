// Vue.component('l-map', window.Vue2Leaflet.LMap);
// link 'http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css';
// @import "~leaflet/dist/leaflet.css";

// $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://unpkg.com/leaflet/dist/leaflet.css'));


// var { LMap, LTileLayer, LMarker } = Vue2Leaflet;

var { LMap, LTileLayer, LMarker, LTooltip } = Vue2Leaflet;

var routermap;

window.cb = function cb(json) {
  //do what you want with the json
  console.log("CALLBACK");
  console.log(json);
  console.log(map.currStop);
  possibleLocations = json.map(e => {
    return {
      "name": e.display_name,
      "latlong": [e.lat, e.lon],
    }
  });

  if (json.length == 0) {
    map.currStop.noLocationResults = true;
  }
  else {
    map.currStop.noLocationResults = false;
  }
  console.log(possibleLocations);
  console.log(map.currHunt.inProgress.currStopId);
  console.log("Assign possible locations");
  map.currStop.possibleLocations = possibleLocations;
}

map = new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker, LTooltip },
  data() {
    return {
      iconImage:"",
      arborAdventureIconSelected:false,
      bookBonanzaIconSelected:false,
      welcomeHomeIconSelected:false,
      inPlayMode: false,
      expandLastAcc: false,
      page: "index", // options ["index", "play", "create", "join"]
      // TODO: diff between current hunt being made vs. being played?
      mapConfig: {
        zoom:14,
        center: L.latLng(42.2808, -83.7430),
        url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      tempImg: null,
      currHunt: {
        expectedDistance: 0,
        expectedTime: 30,
        title: "",
        icon: "",
        id: 0,
        errorString: "",

        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          currStopId: 0,
          numMarkers: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
          evidence: [],
        },
        // TODO: when they publish, remove spaces from ends of all answers
        stops: [
          {
            clue: "Where the graduates study.",
            answer: "Hatcher",
            hint: "It starts with 'hat'",
            task: "Take a photo in the stacks.",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
            expanded: true,
            location: "Hatcher Graduate Library, 913, South University Avenue, Ann Arbor, Washtenaw County, Michigan, 48109, United States",
            possibleLocations: [],
            noLocationResults: false,
          },
          {
            clue: "Where to find computers in Angell Hall.",
            answer: "Fishbowl",
            hint: "Nemo from Finding Nemo might swim in one.",
            task: "Print a poster and upload a photo of the print!",
            points: 15,
            latlong: L.latLng(42.2766, -83.7397),
            expanded: true,
            location: "Angell Hall, 435, South State Street, Ann Arbor, Washtenaw County, Michigan, 48109, United States",
            possibleLocations: [],
            noLocationResults: false,
          },
        ],
      },
      allHunts: [
      {
        id:0,
        completed: false,
        expectedDistance: 1.6,
        expectedTime: 60,
        title: "Welcome Home",
        icon: "src/welcomeHomeIcon.png",
        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          numMarkers: 0,
          currStopId: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
        },
        // TODO: when they publish, remove spaces from ends of all answers
        stops: [
          {
            clue: "Where the graduates study.",
            answer: "Hatcher",
            hint: "It starts with 'hat'",
            task: "Take a photo in the stacks.",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
            expanded: true,
            noLocationResults: false,
          },
          {
            clue: "Where to find computers in Angell Hall.",
            answer: "Fishbowl in Angell Hall",
            hint: "Nemo from Finding Nemo might swim in one.",
            task: "Print a poster and upload a photo of the print!",
            points: 15,
            location: "",
            possibleLocations: [],
            latlong: L.latLng(42.2766, -83.7397),
            expanded: true,
            noLocationResults: false,
          },
        ],
      }, 
      {
        id:1,
        completed: false,
        expectedDistance: 2,
        expectedTime: 120,
        title: "Arbor Adventure", // TODO: add id
        icon: "src/arborAdventureIcon.png",
        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          numMarkers: 0,
          currStopId: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
        },
        // TODO: when they publish, remove spaces from ends of all answers
        stops: [
          {
            clue: "The arb has a special bed of this kind of flower",
            answer: "Peony",
            hint: "It starts with 'p'",
            task: "Take a photo smelling the flowers.",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
            expanded: true,
          },
          {
            clue: "You can see this playwright performed in the Arb",
            answer: "Shakespeare",
            hint: "The bard himself",
            task: "Take a photo on stage, giving your best 'to be or not to be'",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
            expanded: true,
          },
        ],
      },
      {
        id:2,
        completed: false,
        expectedDistance: 2,
        expectedTime: 120,
        title: "Book Bonanza",
        icon: "src/bookBonanzaIcon.png",
        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          currStopId: 0,
          numMarkers: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
        },
      }],      
    };
  },
  mounted() {
  	// const this_map = this.$refs.mymap.mapObject;
    // routermap = this_map;
    // // map.addControl(new L.Control.Fullscreen());

    // console.log(this.makeMarkers);

    // // TODO: make this a helper function
    // markers = this.inPlayMode ? this.guessMarkers : this.makeMarkers;

    // this.router = L.Routing.control({
    //   // TODO: check waypoints appearing
    //   waypoints: markers,   
    //   routeWhileDragging: false,
    //   // TODO: fix dragging problem
    //   lineOptions: {
    //     addWaypoints: false,
    //   },
    //   show: false,
    //   units: 'imperial',
    //   // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',
    // });
        
    // this.router.on('routesfound', function(e) {
    //     // console.log("ROUTES FOUND");
    //     // console.log(e.waypoints);
    //     var routes = e.routes;
    //     var summary = routes[0].summary;
    //     // alert distance and time in miles and minutes
    //     // console.log(summary.totalDistance / 1760 + ' mi');
    //     // console.log(summary.totalTime % 3600 / 60 + ' min');
    //     map.currHunt.expectedTime = (summary.totalTime % 3600 / 60).toFixed(2);
    //     map.currHunt.expectedDistance = (summary.totalDistance / 1760).toFixed(2);
    //     // map.currHunt.expectedTime = ((summary.totalDistance / (1760 * 2.5)) % 3600 / 60).toFixed(2);

    //     // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    // });
    
    // this.router.addTo(routermap);
  },
  updated() {
    console.log("Updated!");
    e = document.getElementById('#collapse' + this.currHunt.stops.length - 1);
    // console.log(e);
    if (this.expandLastAcc) {
      this.expandLastAcc = false;
      $('#collapse' + String(this.currHunt.stops.length - 1)).collapse('show');
    }
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip({
          placement : 'right'
      });
    });
  },
  methods: {
    selectIcon(event){
      // arborAdventureIconSelected:true,
      // bookBonanzaIconSelected:false,
      // welcomeHomeIconSelected:false,
      var iconSelected = event.target.id;
      this.arborAdventureIconSelected = false;
      this.bookBonanzaIconSelected = false;
      this.welcomeHomeIconSelected = false;

      if(iconSelected == "aaIcon"){
        this.iconImage = "src/arborAdventureIcon.png";
        this.arborAdventureIconSelected = true;
      }
      else if(iconSelected == "bbIcon"){
        this.iconImage = "src/bookBonanzaIcon.png";
        this.bookBonanzaIconSelected = true;
      }
      else if(iconSelected == "whIcon"){
        this.iconImage = "src/welcomeHomeIcon.png";
        this.welcomeHomeIconSelected = true;
      }
      console.log("icon:", this.iconImage);
      this.currHunt.icon = this.iconImage;
    },
    loadHunt: function(id){
      this.page = "play";
      this.inPlayMode = true;
      // this.currHunt = this.allHunts[id];
      // console.log("loadHunt");
      // console.log("loadHunt");
      // Start countdown of time remaining


      // update time so far

    },
    registerMarker: function(e) {
        // console.log(e);
    },
    setTimeAndDistance: function(time, distance) {
        // console.log(time, distance);
        this.currHunt.expectedDistance = distance.toFixed(2);
        this.currHunt.expectedTime = time.toFixed(2);
    },
    updateGuess: function() {
      if (this.currHunt.inProgress.guessText.length < this.currHunt.inProgress.tempGuess.length) {
        // Backspace
        this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText.substring(0, this.currHunt.inProgress.guessText.length - 1);
      } else {
        // Type something
        this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText + " ";
      }
      this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText.toUpperCase();
      this.currHunt.inProgress.tempGuess = this.currHunt.inProgress.guessText;
    },
    showHint: function() {
      this.currHunt.inProgress.hintClicked = true;
    },
    convertAnswerToCaps: function(answer) {
      // console.log(answer.toUpperCase().split('').join('\xa0'));
      return answer.toUpperCase().split('').join('\xa0');
    },
    checkAnswer: function(answer, guess) {

      // Strip all non-alphanumeric characters
      stripped_answer = answer.replace(/\W/g, '').toUpperCase();
      stripped_guess = guess.replace(/\W/g, '').toUpperCase();

      // console.log("CHECK ANSWER")
      // console.log(stripped_answer);
      // console.log(stripped_guess);
      return stripped_answer === stripped_guess;
    },
    // TODO: keep commas and spaces and such in the answer
    makeGuess: function() {
      if (this.checkAnswer(this.currStop.answer, this.currHunt.inProgress.guessText)) {
        // console.log("Correct!");
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = true;
        this.currHunt.inProgress.numPoints += this.currStop.points;
        this.currHunt.inProgress.numMarkers += 1;

        markers = this.guessMarkers;
        // console.log(this.guessMarkers);

        if (this.router) {
          routermap.removeControl(this.router);
        } else {
          const this_map = this.$refs.mymap.mapObject;
          routermap = this_map;
        }
        this.router = L.Routing.control({
          // TODO: check waypoints appearing
          waypoints: markers,   
          routeWhileDragging: false,
          // TODO: fix dragging problem
          lineOptions: {
            addWaypoints: false,
          },
          show: false,
          units: 'imperial',
          // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',
        });

        // TODO: figure out how to replace the router
            
        this.router.on('routesfound', function(e) {
            // console.log("ROUTES FOUND");
            // console.log(e.waypoints);
            var routes = e.routes;
            var summary = routes[0].summary;
            // alert distance and time in miles and minutes
            // console.log(summary.totalDistance / 1760 + ' mi');
            // console.log(summary.totalTime % 3600 / 60 + ' min');
            map.currHunt.expectedTime = (summary.totalTime % 3600 / 60).toFixed(2);
            map.currHunt.expectedDistance = (summary.totalDistance / 1760).toFixed(2);
            // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
        });
        
        this.router.addTo(routermap);

      } else {
        // console.log("Wrong Guess!");
        this.currHunt.inProgress.tryAgain = true;
      }
    },
    pressNuclear: function() {
      this.currHunt.inProgress.numPoints -= 50;
      this.currHunt.inProgress.correct = true;
    },
    nextClue: function() {
      // console.log("NEXT CLUE");
      this.allHunts[this.currHunt.id].inProgress.evidence.push(this.tempImg);
      if (this.currHunt.inProgress.currStopId == this.currHunt.stops.length - 1) {
        alert(`CONGRATULATIONS YOU'RE DONE!!!\nTime taken: ${this.currHunt.inProgress.timeSoFar}\nPoints: ${this.currHunt.inProgress.numPoints}`);
        this.allHunts[this.currHunt.id].completed = true;
        Vue.set(this.allHunts[this.currHunt.id].finalStats, "numPoints", this.currHunt.inProgress.numPoints);
        Vue.set(this.allHunts[this.currHunt.id].finalStats, "timeTaken", this.currHunt.inProgress.timeSoFar);
        console.log(this.allHunts);
        this.goBack();
      } else {
        this.currHunt.inProgress.currStopId += 1;
        this.currHunt.inProgress.guessText = "";
        this.currHunt.inProgress.tempGuess = "";
        this.currHunt.inProgress.hintClicked = false;
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = false;
        this.tempImg = null;
      }
    },
    prepareEvidence: function(files) {
      console.log("prepareEvidence");
      console.log(files);
      // No file submitted
      if (!files.length) {
        this.tempImg = null;
        return;
      }
      this.tempImg = URL.createObjectURL(files[0]);
      console.log(this.tempImg);

    },
    deleteStop: function(i) {
      // TODO: make sure to add an "are you sure? popup"
      this.currHunt.stops.splice(i, 1);
      // TODO: decrement currStop if it's after i - make sure it's still open
    },
    addStop: function() {
      // Change "add stop" to "save":
      var ogbtn = $('#addStopBtn').html();

      // console.log("ADD STOP");
      // $("#collapse" + this.currHunt.stops.length - 1).collapse({
      //   show: true
      // });
      // console.log(this.currHunt.stops.length - 1);
      // this.$nextTick(function () {
      //   console.log("TICK");
      //   e = document.getElementById('#collapse' + this.currHunt.stops.length - 1);
      //   console.log(e);
      //   $('#collapse' + this.currHunt.stops.length - 1).collapse('show');
      // });
      // setTimeout( () => {}, 1000);



      // if(ogbtn == "Save Stop"){
      //   this.validateForm();
      //   // $('#addStopBtn').html("Add Stop");
      //   // $('#collapse' + String(this.currHunt.stops.length - 1)).collapse('hide');
      //   // this.expandLastAcc = false;
      // }
      // else{

        // $('#addStopBtn').html("Save Stop");
        this.currHunt.stops.push( {
        clue: "",
        answer: "",
        hint: "",
        task: "",
        points: 15,
        latlong: null,
        expanded: true,
        location: "",
        possibleLocations: [],
      });
        map.currHunt.inProgress.currStopId = this.currHunt.stops.length - 1;
        this.expandLastAcc = true;
      // }


    },
    moveStopUp: function(idx) {
      console.log("move stop up" + idx);
      if (idx != 0) {
        var temp = this.currHunt.stops[idx];
        Vue.set(this.currHunt.stops, idx, this.currHunt.stops[idx - 1]);
        Vue.set(this.currHunt.stops, idx - 1, temp);
      }
      console.log(this.currHunt.stops);
    },
    moveStopDown: function(idx) {
      console.log("move stop down" + idx);
      if (idx < this.currHunt.stops.length - 1) {
        var temp = this.currHunt.stops[idx];
        Vue.set(this.currHunt.stops, idx, this.currHunt.stops[idx + 1]);
        Vue.set(this.currHunt.stops, idx + 1, temp);
      }
      console.log(this.currHunt.stops);
    },
    publish: function() {
      console.log("Publish");
      // Check for additional errors that are outside forms.
      this.currHunt.errorString = ''

      if (this.currHunt.title === "") {
        this.currHunt.errorString += "Provide a title for your hunt.<br>"
      }
      if (this.currHunt.icon === "") {
        this.currHunt.errorString += "Select an icon for your hunt.<br>"
      }
      if (this.currHunt.stops.length === 0) {
        this.currHunt.errorString += "Provide at least one stop.<br>"
      }
      if (!$("#minutes").val() || !$("#hours").val()) {
        this.currHunt.errorString += "Set a time limit.<br>"
      }

      // Error check all forms on the page (time limit, individual stops, title)
      if (this.allFormsValid()) {
        // No additional errors! Go ahead and publish.
        if (this.currHunt.errorString === "") {
          // TODO: check for 0 hours 0 minutes make time limit
          // var timelimit = document.getElementById('mins').value + (60*document.getElementById('hours').value)

          // Strip any trailing whitespace
          // this.currHunt.stops.forEach( s => s.answer.strip());

          this.currHunt.expectedTime = 60;
          this.allHunts.push(this.currHunt);
          this.switchPage("join");
        }     
      }
      console.log(this.currHunt.errorString);
      // $('#errorMessage').html(this.currHunt.errorString);
    },    
    searchLocation: function(q) {
    // query = e.target.value;
    query = q;
    console.log(q)
    // console.log("Searching for " + e.target.value);

    cleaned_query = query.replace(' ', '+');

    if (!cleaned_query.includes("ann") && !cleaned_query.includes("Ann")) {
      cleaned_query +=  ",ann+arbor";
    }

    // TODO: overwrite
    // With help from: https://stackoverflow.com/questions/10923769/simple-reverse-geocoding-using-nominatim
    var s = document.createElement('script');     
    s.setAttribute("id", "locSearchScript");  
    s.src = 'http://nominatim.openstreetmap.org/search?json_callback=cb&format=json&q=' + cleaned_query;
    document.getElementsByTagName('head')[0].appendChild(s);
    // TODO: attribute!
    // // console.log("Calling iTunes API with: https://itunes.apple.com/search?attribute=allArtistTerm&term=" + cleaned_query);
    // axios.get("https://nominatim.openstreetmap.org/search?email=fee.christoph@gmail.com&q=" + cleaned_query + '+ann+arbor/', {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     'User-Agent':'Axios 0.21.1',
    //   },
    //   proxy: {
    //     host: 'localhost',
    //     port: 5500
    //   }
    // })
    //   .then(response => {
          
    //     // Log response
    //     console.log("Returned JSON object:");
    //     console.log(response);
    //   }).catch(e => console.log(e));
    }, 
    // TODO: set time to be walking time
    // TODO: also make sure that you can get the possible locations for any location
    setLocation(stop_i, possible_loc_i) {
      console.log("Set location");
      console.log(stop_i, possible_loc_i);
      chosenLoc = this.currHunt.stops[stop_i].possibleLocations[possible_loc_i];
      this.currHunt.stops[stop_i].latlong = L.latLng(chosenLoc.latlong[0], chosenLoc.latlong[1])
      this.currHunt.stops[stop_i].location = chosenLoc.name;
      
      // TODO: prefer to keep previous possible locations? and just hide them after click?
      this.currHunt.stops[stop_i].possibleLocations = [];

      markers = this.inPlayMode ? this.guessMarkers : this.makeMarkers;

      // TODO: make this a helper function 
      // TODO: zoom map to markers
      if (this.router) {
        routermap.removeControl(this.router);
      } else {
        const this_map = this.$refs.mymap.mapObject;
        routermap = this_map;
      }
      this.router = L.Routing.control({
        // TODO: check waypoints appearing
        waypoints: markers,   
        routeWhileDragging: false,
        // TODO: fix dragging problem
        lineOptions: {
          addWaypoints: false,
        },
        show: false,
        units: 'imperial',
        // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',
      });
          
      this.router.on('routesfound', function(e) {
          // console.log("ROUTES FOUND");
          // console.log(e.waypoints);
          var routes = e.routes;
          var summary = routes[0].summary;
          // alert distance and time in miles and minutes
          // console.log(summary.totalDistance / 1760 + ' mi');
          // console.log(summary.totalTime % 3600 / 60 + ' min');
          map.currHunt.expectedTime = (summary.totalTime % 3600 / 60).toFixed(2);
          map.currHunt.expectedDistance = (summary.totalDistance / 1760).toFixed(2);
          // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
      });
      
      this.router.addTo(routermap);

      $('#loc'+stop_i).hide();

    }, 
    setActiveStop: function(i) {
      // console.log(i);
      this.currHunt.inProgress.currStopId = i;
    }, 
    switchPage: function(pageIn, idIn=null) {
      // console.log("SWITCHING PAGE TO: " + pageIn);
      // let pageIn;
      // let idIn;
      // let split_args_array = args.split(",");
      // pageIn = split_args_array[0]
      // if(split_args_array.length > 1) {
      //   idIn = split_args_array[1];
      // }
      this.page = pageIn;

      if (pageIn == "join") {
        this.inPlayMode = false;
      } else if (pageIn == "create") {
        this.inPlayMode = false;
        // Initialize new blank hunt
        this.currHunt = {
            expectedDistance: 0,
            expectedTime: 0,
            title: "", // TODO: add id
            icon: "",
            id: this.allHunts.length,
            errorString: '',
            inProgress: {
              timeSoFar: 0,
              distanceSoFar: 0,
              numPoints: 0,
              currStopId: 0,
              numMarkers: 0,
              guessText: "",
              tempGuess: "",
              hintClicked: false,
              tryAgain: false,
              correct: false,
            },
            // TODO: when they publish, remove spaces from ends of all answers
            stops: [],
        };
      } else if (pageIn == "play") {
        this.inPlayMode = true;
        this.currHunt = this.allHunts[idIn];
        console.log(this.currHunt);
        setInterval(()=>{
          this.currHunt.inProgress.timeSoFar += 1;

          }
          , 60000);

      } else if (pageIn == "index") {
        this.inPlayMode = false;
      } else {
        console.log("Not a valid page to switch to: " + pageIn);
      }
    }, 
    goBack: function() {
      if (this.page == "play") {
        this.switchPage("join");
        return;
      }
      this.switchPage("index");
    },
    validateForm: function(formName) {
      // this.allFormsValid();
      console.log("validate form");
      console.log(formName);

      var form = document.querySelector(formName + '.needs-validation');
      var header = document.querySelector('#accordion-item-' + formName[formName.length - 1]);
      console.log(header);
      console.log(form);
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        if (!form.checkValidity()) {
          console.log("invalid form");
          console.log(form);
          invalidFormsPresent = true;
          header.classList.add('invalid');
        }
        else {
          header.classList.remove('invalid');
          $('#collapse' + String(this.currHunt.inProgress.currStopId)).collapse('hide');
        }
        form.classList.add('was-validated');
    },
    allFormsValid: function() {
      var forms = document.querySelectorAll('.needs-validation')
      
      console.log("VALIDATING FORMS");
      console.log(forms);
      // Loop over them and prevent submission

      invalidFormsPresent = false;

      forms.forEach(form => {

      
      var header = document.querySelector('#accordion-item-' + form.id[form.id.length - 1]);
      console.log(header);
      console.log(form);
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        if (!form.checkValidity()) {
          console.log("invalid form");
          console.log(form);
          invalidFormsPresent = true;
          if (header) {
            header.classList.add('invalid')
          }
        }
        else {
          if (header) {
            header.classList.remove('invalid')
          }
        }
        form.classList.add('was-validated');
      })

      return !invalidFormsPresent;
    },
  }, 
  computed: {
    makeMarkers: function() {
      console.log(this.currHunt.stops.map(s => s.latlong));
      return this.currHunt.stops.map(s => s.latlong);
    },
    guessMarkers: function() {
      // console.log("GUESS MARKERS");
      if (!this.currHunt.inProgress.numMarkers) {
        return []
      }
      return this.makeMarkers.slice(0, this.currHunt.inProgress.numMarkers);
    }, 
    getStopNames: function() {
      return this.currHunt.stops.map(s => s.answer);
    },
    answerLength: function() {
      return this.placeholder.length;
    },
    placeholder: function() {
      var alphanumRegex = /^[0-9a-zA-Z]+$/;
      hashes = "";

      for (var i = 0; i < this.currStop.answer.length; i++) {
        l = this.currStop.answer[i];
        if (l.match(alphanumRegex)) {
          // Need \xa0 as non-breaking whitespace so the form will keep whitespaces
          hashes += '_' + '\xa0';
        }
        else {
          hashes += l + '\xa0';
        }
      }
      // hashes = '_'.repeat(this.currStop.answer.length).split('').join(' ');
      console.log("hashes: ", hashes);
      return hashes.substring(0, hashes.length - 1);
    },
    currStop: function() {
      return this.currHunt.stops[this.currHunt.inProgress.currStopId];
    },
    onIndexPage: function() {
      return this.page == "index";
    },
    onJoinPage: function() {
      return this.page == "join";
    },
    onCreatePage: function() {
      return this.page == "create";
    },
    onPlayPage: function() {
      return this.page == "play";
    },
  }
});

// console.log("I think Vue just rendered?");
// console.log(map.makeMarkers);

function auto_height(elem) {  /* javascript */
  elem.style.height = "1px";
  elem.style.height = (elem.scrollHeight)+"px";
}
