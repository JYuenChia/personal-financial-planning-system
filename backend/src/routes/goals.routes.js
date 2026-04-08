const express = require("express");
const { v4: uuidv4 } = require("uuid");

const { requireAuth } = require("../middleware/auth.middleware");
const { findById: findUserById } = require("../repositories/user.repository");
const {
  createGoal,
  deleteGoal,
  findById: findGoalById,
  listGoals,
  updateGoal,
} = require("../repositories/goals.repository");
const {
  goalCreateSchema,
  goalUpdateSchema,
} = require("../schemas/goal.schema");

const router = express.Router();

function toPublicGoal(goal) {
  if (!goal) return null;

  return {
    id: goal._id,
    user_id: goal.user_id,
    title: goal.title,
    target_amount: goal.target_amount,
    current_amount: goal.current_amount,
    target_date:
      goal.target_date instanceof Date
        ? goal.target_date.toISOString()
        : goal.target_date,
    risk_appetite: goal.risk_appetite,
    created_at: goal.created_at,
    updated_at: goal.updated_at,
  };
}

function canAccessGoal(auth, goal) {
  return auth.role === "admin" || goal.user_id === auth.userId;
}

async function getAccessibleGoal(req, res, goalId) {
  const goal = await findGoalById(goalId);

  if (!goal) {
    res.status(404).json({ error: "Goal not found" });
    return null;
  }

  if (!canAccessGoal(req.auth, goal)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return goal;
}

router.use(requireAuth);

router.get("/goals", async (req, res) => {
  try {
    const goals =
      req.auth.role === "admin"
        ? await listGoals()
        : await listGoals({ userId: req.auth.userId });

    return res.status(200).json({ goals: goals.map(toPublicGoal) });
  } catch (error) {
    console.error("List goals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/goals", async (req, res) => {
  try {
    const parsed = goalCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid goal payload" });
    }

    const ownerId = parsed.data.user_id || req.auth.userId;

    if (
      parsed.data.user_id &&
      req.auth.role !== "admin" &&
      parsed.data.user_id !== req.auth.userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const owner = await findUserById(ownerId);

    if (!owner) {
      return res.status(404).json({ error: "User not found" });
    }

    const goal = await createGoal({
      _id: uuidv4(),
      user_id: ownerId,
      title: parsed.data.title,
      target_amount: parsed.data.target_amount,
      current_amount: parsed.data.current_amount ?? 0,
      target_date: parsed.data.target_date,
      risk_appetite: parsed.data.risk_appetite,
    });

    return res.status(201).json({ goal: toPublicGoal(goal) });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/goals/:id", async (req, res) => {
  try {
    const goal = await getAccessibleGoal(req, res, req.params.id);

    if (!goal) {
      return;
    }

    return res.status(200).json({ goal: toPublicGoal(goal) });
  } catch (error) {
    console.error("Get goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/goals/:id", async (req, res) => {
  try {
    const parsed = goalUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid goal payload" });
    }

    const goal = await getAccessibleGoal(req, res, req.params.id);

    if (!goal) {
      return;
    }

    if (parsed.data.user_id && req.auth.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (parsed.data.user_id) {
      const owner = await findUserById(parsed.data.user_id);

      if (!owner) {
        return res.status(404).json({ error: "User not found" });
      }
    }

    const updated = await updateGoal(goal._id, {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.target_amount !== undefined
        ? { target_amount: parsed.data.target_amount }
        : {}),
      ...(parsed.data.current_amount !== undefined
        ? { current_amount: parsed.data.current_amount }
        : {}),
      ...(parsed.data.target_date !== undefined
        ? { target_date: parsed.data.target_date }
        : {}),
      ...(parsed.data.risk_appetite !== undefined
        ? { risk_appetite: parsed.data.risk_appetite }
        : {}),
      ...(req.auth.role === "admin" && parsed.data.user_id !== undefined
        ? { user_id: parsed.data.user_id }
        : {}),
    });

    return res.status(200).json({ goal: toPublicGoal(updated) });
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/goals/:id", async (req, res) => {
  try {
    const goal = await getAccessibleGoal(req, res, req.params.id);

    if (!goal) {
      return;
    }

    const result = await deleteGoal(goal._id);

    if (!result.deletedCount) {
      return res.status(404).json({ error: "Goal not found" });
    }

    return res.status(200).json({ status: "goal_deleted" });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
