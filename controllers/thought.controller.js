const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        return res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a thought
  getSingleThought(req, res) {
    Thought.findById(req.params.thoughtId)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(async function (thought) {
        // Update User's thought array

        await User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { runValidators: true, new: true }
        );

        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndRemove(req.params.thoughtId);
      //console.log(thought);

      if (thought) {
        const user = await User.updateOne(
          { username: thought.username },
          {
            $pull: { thoughts: req.params.thoughtId },
          }
        );
        //console.log(user);
      } else {
        res.status(404).json({ message: "No such thought exists" });
      }
      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // create a reaction
  createReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $addToSet: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { runValidators: true, new: true, returnDocument: "after" }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // delete a reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);

      const result = thought.reactions.find((reaction) => reaction._id == req.params.reactionId);

      thought.reactions.remove(result);

      thought.save();
      
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
