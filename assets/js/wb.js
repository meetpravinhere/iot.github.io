    //Using the HiveMQ public Broker, with a random client Id
    var client = new Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

    //var subscribeName1='test1';
    //var subscribeName2='test2';
    //var subscribeName3='test3';

    //Connect Options
    var options = {
        timeout: 3,
        //Gets Called if the connection has sucessfully been established
        onSuccess: function () {
           alert("Connected to mqtt server");
            client.subscribe('4600/Texas/Temperature', { qos: 2 });
            client.subscribe('4600/Texas/Humidity', { qos: 2 });
            client.subscribe('4600/Texas/Moisture', { qos: 2 });

           // client.subscribe(subscribeName1, {qos: 2});
           // client.subscribe(subscribeName2, {qos: 2});
            //client.subscribe(subscribeName3, {qos: 2});
        },
        //Gets Called if the connection could not be established
        onFailure: function (message) {
            alert("Connection failed: " + message.errorMessage);
        }
    };

    // function addSubscription()
    // {
    //   client.subscribe(subscribeName1, {qos: 2});
    //   client.subscribe(subscribeName2, {qos: 2});
    //   client.subscribe(subscribeName3, {qos: 2});
    // }

    $(document).ready(function () {
        client.connect(options);
       callAngularFunction();
    });

    function callAngularFunction(topic, submessage, date) {
      window.angularComponentReference.zone.run(() => {
         window.angularComponentReference.loadAngularFunction(topic, submessage, date);
        });

        $.ajax({
          type: "GET",
          url: 'http://localhost:3000/addSensorValues',
          data: {topic:topic, value: submessage},
          contentType: "application/json; charset=utf-8",
          dataType: "jsonp",
          crossDomain:true,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
      });
   }

   function addSensorData(topic, submessage, date) {
      $.ajax({
        type: "GET",
        url: 'http://localhost:3000/addSensorValues',
        data: {topic:topic, value: submessage},
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        crossDomain:true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
    });
 }
    //Gets  called if the websocket/mqtt connection gets disconnected for any reason
    client.onConnectionLost = function (responseObject) {
        //Depending on your scenario you could implement a reconnect logic here
        alert("connection lost: " + responseObject.errorMessage);
    };

    //Gets called whenever you receive a message for your subscriptions
    client.onMessageArrived = function (message) {
      	//alert(message.payloadString);
        //Do something with the push message you received
        // $('#messages').append('<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>');
        debugger;
        if (message.destinationName == "4600/Texas/Temperature") {
            callAngularFunction(message.destinationName, message.payloadString, GetFormatedDate());

           // $('#4600/Texas/Temperature').text(message.payloadString);
            //addSensorData(message.destinationName, message.payloadString, GetFormatedDate());
           // $('#lblTempDate').text(GetFormatedDate());
        }
        else if (message.destinationName == "4600/Texas/Humidity") {
            callAngularFunction(message.destinationName, message.payloadString, GetFormatedDate());
            //$('#4600/Texas/Humidity').text(message.payloadString);
            //addSensorData(message.destinationName, message.payloadString, GetFormatedDate());
           // $('#lblHumiDate').text(GetFormatedDate());
        }
        else if (message.destinationName == "4600/Texas/Moisture") {
            callAngularFunction(message.destinationName, message.payloadString, GetFormatedDate());
            //$('#4600/Texas/Humidity').text(message.payloadString);
            //addSensorData(message.destinationName, message.payloadString, GetFormatedDate());
           // $('#lblMoisDate').text(GetFormatedDate());
        }
    };

    function GetFormatedDate() {
        //var d = new Date();
        //var strDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + "/" +  d.getTime();
        //return strDate;

        var today = new Date();
        var date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime;
    }
    //Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
    var publish = function (payload, topic, qos) {
        //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
        var message = new Messaging.Message(payload);
        message.destinationName = topic;
        message.qos = qos;
        client.send(message);
    }

    function switchMotor(value)
    {
      publish(value, 'motor', 2);
    }



