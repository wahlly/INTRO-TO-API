const baseUrl ='https://opentdb.com/api.php?amount=10'
const contentDiv = document.querySelector('.question');


//fetching API asynchronously...
const getQuestions = async () => {
    const response = await fetch(`${baseUrl}`);
    const questions = await response.json();
    return questions;
}


window.addEventListener('load', async () =>{
    const questionData = await getQuestions();

//iterating through the APIs Object...
    const triviaQuestion = await questionData.results;
        for(let i = 1; i < triviaQuestion.length; i++){
        contentDiv.innerHTML += `
            <ul>
            <h3>${i}. ${triviaQuestion[i].category}</h3>
            <p>${triviaQuestion[i].question}</p>
            </ul>
        `
    }
})