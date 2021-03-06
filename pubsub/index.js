// Create a pubsub client.
var pubsub = require('gcloud').pubsub({
  // We're using the API from the same project as the Cloud Function.
  projectId: process.env.GCP_PROJECT,
});

module.exports = {

  /**
   * Publishes a message to a Cloud Pub/Sub Topic.
   */
  publish: function(data) {

    var topicName = data['topic'];
    var message = data['message'];

    if (!topicName) {
      throw 'Topic not provided. Make sure you have a \'topic\' property in ' +
          'your request';
    }
    if (!message) {
      throw 'Message not provided. Make sure you have a \'message\' property ' +
          'in your request';
    }

    console.log('Publishing message to topic ' + topicName);

    // The Pub/Sub topic must already exist.
    var topic = pubsub.topic(topicName);

    // Pub/Sub messages must be valid JSON objects.
    topic.publish(
        {
          data: {
            message: message,
          },
        },
        function(err) {
          if (err) {
            context.failure(err);
          } else {
            context.success();
          }
        });
  },


  /**
   * Triggered from a message on a Pub/Sub topic.
   */
  subscribe: function(data) {
    // We're just going to log the message to prove that it worked!
    console.log(data['message']);
  },
};
