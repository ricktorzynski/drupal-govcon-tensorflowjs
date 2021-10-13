(function ($, Drupal, window, document) {

  async function loadModel(){
    const MODEL_URL = '/modules/custom/tensorflow/models/book_recommender/model.json';
    const model = await tf.loadLayersModel(MODEL_URL)
    console.log(model.summary())
    return model;
  }

  function getRecommendations() {
    const userId = document.getElementById("userId").value;
    recommend(userId).then((value) => display(value))
  }

  function display(recommendations) {
    const output = document.getElementById("output");
    console.log(recommendations.length)
    console.log(recommendations)
    output.innerHTML = ""
    for (i = 0; i < recommendations.length; i++) {
      data = recommendations[i]
      num = i + 1
      output.innerHTML += "<b>Recommendation #" + num + "</b><br>";
      output.innerHTML += '<img src="' + data.image_url + '" title="' + data.title + '"><br>';
      output.innerHTML += "Title: " + data.title + "<br>";
      output.innerHTML += "Author(s): " + data.authors + "</br>";
      output.innerHTML += "Publication Year: " + parseInt(data.original_publication_year) + "<p>";
    }
  }

  async function recommend(userId) {
    
    const book_len = books.length
    const book_arr = tf.range(0, books.length)
    let user = tf.fill([book_len], Number(userId))

    let book_in_js_array = book_arr.arraySync()
    model = await loadModel();
    console.log(`Recommending for User: ${userId}`)
    pred_tensor = await model.predict([book_arr, user]).reshape([10000])
    pred = pred_tensor.arraySync()

    let recommendations = []
    for (let i = 0; i < 5; i++) {
      max = pred_tensor.argMax().arraySync()
      recommendations.push(books[max]) //Push book with highest prediction probability
      pred.splice(max, 1)    //drop from array
      pred_tensor = tf.tensor(pred) //create a new tensor
    }
    return recommendations
  }

  Drupal.behaviors.Predict = {
    attach: function (context, settings) {
      $('#recommend').once().click(function () {      
        getRecommendations();
      });
    }
  };

}(jQuery, Drupal, this, this.document));