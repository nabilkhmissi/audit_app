const { Question, QuestionCategory } = require("../models");

//find all questions
module.exports.findAll = async function (req, res, next) {
  try {
    const questions = await Question.find();
    return res.status(200).send({ data : questions, message : "Questions retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting Questions"))
  }
}
module.exports.findCategories = async function (req, res, next) {
  try {
    const questions = await QuestionCategory.find();
    return res.status(200).send({ data : questions, message : "Questions categories retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting Questions categories"))
  }
}

//create question
module.exports.create = async function (req, res, next) {
  try {
    const question = await Question.create({
      question : req.body.question,
      category : req.body.category
    })
    
    return res.status(200).send({ data : question, message : "Question created successfully" });
  } catch (error) {
    next(Error("Error while creating question"))
  }
}

//delete question
module.exports.delete = async function (req, res, next) {
  try {
    const question = await Question.findById(req.params.id);
    question.isDeleted = !question.isDeleted;
    const deleted = await question.save()
    return res.status(200).send({ message : "Question deleted successfully", data : deleted });
  } catch (error) {
    next(Error("Error while deleteing question"))
  }
}

module.exports.update = async function (req, res, next) {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, {
      question : req.body.question
    }, { new : true });   
    
    return res.status(200).send({ data : updated, message : "Question updated successfully" });
  } catch (error) {
    next(Error("Error while creating question"))
  }
}