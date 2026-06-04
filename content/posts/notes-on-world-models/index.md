+++
title = 'Notes on World Models'
date = 2026-05-25T00:00:00+00:00
group = "theory"
mathjax = true
+++

## Dreamer "Dream to Control: Learning Behaviors by Latent Imagination"

### Definitions
- Agent is someone who learned the system in which he operates
- Environment, it provides rewards and images within the world
- Observation `o_t`, entity agent observes at `t` (time), this is an image in this paper
- Action `a_t`, agent predicts control vector at time `t`
- Reward `r_t`, score returned from the environment at time `t`
- Return, sum of rewards. Agent that makes a high return is better
- Policy, rule, maps state into action. Dreamer policy => action model
- Model, function with learned params
- World model, model that learns from env, predicts **latent state and rewards**
- Dynamics: how does the state change (over time) after action
  - this happens in image space (not latent space)
  - i'm not sure if i understand how is this different from the "next state"
  - maybe it's some metric that defines change over multiple states through time
- latent dynamics
  - same, but in latent space
- Imagination, agent has imagination if he can predict future states and rewards
- Latent imagination
  - same but inside of latent space
- Actor critic, two learned parts:
  1. actor: chooses an action
  2. critic (value model): estimates state value of latent state
    - "given imagined latent state, how much future reward can i get if the actor keeps choosing actions"
    -  
- Value, **expected** future return for a given state
- Discount factory `y` (`y < 1`), controls contribution of rewards in the far future to have less impact
- Horizon, number of imagined future steps

### Abstract

Dreamer, RL agent that learns world model from images. Through imagining future in latent space, it learns the behavior. All actions and values come from **imagined latent trajectories**, it does not learn from image space at all. Why is this better?
1. Better data efficiency
  - images have too many pixels
  - they are compress into latent state (information encoding)
2. Less compute time
3. Higher overall performance of the model
  - performance isn't yet defined
  - planning on long horizons in image space is hard because there are more possible values, and previous result can matter down the line

Technical ideas:
1. latent dynamics model, encodes images into latent space, predicts future latent state
2. action model, predicts action
  - propagate gradients through imagined trajectories
  - input: latent state
  - output: action
3. value model, predicts future return
  - input: latent state
  - output: expected return
  - this a critic that's used as heuristics for estimating how good the final imagined state is
  - it encodes a total future value (even after a fixed horizons)
  - we need this because rolling out many future states (large horizon) is expensive


### (1) Introduction

Motivation: represent the world because it allows acting in situations not seen before

World model can represent this knowledge

Issues with prior agents (papers):
1. optimize rewards for a fixed imagination horizon
  - this is an obvious bottleneck
2. they don't use gradients from NN's
  - what??? this seems a bit shocking
  - note: check what older methods used instead of using gradients from NNs
    - it might probably be pure RL sparse reward system
    - todo: check if this is correct by checking which paper this paragraph references
- dreamer fixes both of these issues
- older derivate-free optimizations:
  - must try many candidates (score many of actions and keep best ones)
  - it allows multistep returns (e.g. simulate three steps) but it gets expensive fast
- analytic gradients: backprop through imagined latent trajectory and update params directly
  - this is allows multistep returns!

examples/tasks they are attacking"
1. contact dynamics
  - multiple legs that can touch the floor
2. sparse rewards
  - not sure what this concretely means at the moment
3. many degrees of freedom
  - agent can control many things at once
    - e.g. 4 legs, each has two joints
4. long horizon behavior
  - e.g. you see a huge wall ahead of you, start running more slowly to conserve energy for the big jump


### (2) Control with world models

defines:
- RL setups
- tasks: POMDP (partially observable Markov decision process)
- markov decision process:
  - input: current state, action
  - output: probability distribution over next states + reward
- what does partially observable mean? agent does not see the true state, it only sees observations (images)

dreamer learns 3 goals:
1. learn latent dynamics model (LDM) from past experience
2. learn action/value models for imagined latent trajectories (ILT)
3. use learned action model in real env => collect more data

RL setup at timestamp `t`:
1. agent samples action `a_t`
  - sampled action: `a_t ~ p(a_t | o_≤t, a_<t)`
  - action depends on: all previous observations and actions (before `t`)
2. env returns observation `o_t` and reward `r_t`
  - `o_t, r_t ~ p(o_t, r_t | o_<t, a_<t)`
  - again, sampled observation and reward at `t` depend on previous observations and actions (before `t`)
3. objective: maximize expected total reward
  - `E_p[Σ_{t=1}^T r_t]`
  - `E_p` expectation for process `p`, real environment
  - `T` is episode length
  - `r_t` is reward at time `t`
  - note: why does it make sense to sum over rewards instead of choosing the `r_t` of the final episode?
    - it's because reward of each step does not contain previous rewards!
    - policy a: +1 +1 +1 => 3 is better than
    - policy b: -2 -2 +3 => -1
    - reward occurs only for a single action taken

Latent dynamics model has three parts
1. representation model
  - encodes current image AND past latent state, into a new latent state
  - $p(s_t \mid s_{t-1}, a_{t-1}, o_t)$
  - `s_t` - latent space at `t`
  - `o_t` - current image observation
  - `p` distribution, real observed data
2. transition model
  - $s_t \sim q(s_t \mid s_{t-1}, a_{t-1})$
  - `q` - learned approximation for imagination
  - predicts `s_t` WITHOUT having `o_t` information
    - it only predicts from a previous state and action
    - this is what "predicting in latent space" implies
    - when im globally at timestep `t`, i won't produce `s_t` with this transition model, because that would mean that i'm 'imagining a state' at `t`, when in fact, i should get the `s_t` by observing and encoding the image via `representation model`
    - in summary, transition model is used only to predict future latent states, that can't be produced by a representation model at future timesteps
3. reward model
  - $r_t \sim q(r_t \mid s_t)$
  - predicts the reward from latent state
4. action model
  - $a_t \sim q(r_t \mid s_t)$
  - predicts an action for a given latent state `s_t`

`p` vs `q`:
- `p` real environment data distribution (images)
- `q` learned approximation used in imagination
- dreamer doesn't know `p`, rather, it learns `q`


```
real observed step:
  previous latent state (`s_{t-1}`) + previous action (`a_{t-1}`) + current image (`o_t`)
  -> representation model
  -> current latent state `s_t`

a_t = actor(s_t)

imagined future step:
  current latent state `s_t` + imagined action (`a_t`)
  -> transition model
  -> future latent state (`s_{t+1}`)
```

however, during training, you still compute transition prediction for `s_t`!
- motivation: use better posterior state using the image, transition model is trained to match it
- what this means: "okay transition model, predict your `s_t` (prior latent state), but after that, compare the output of representation model `s_t` (posterior latent state) that used the observed image. if your `s_t` differs, you're punished"
- we're not comparing raw vectors, we're comparing distributions via KL
- note that `s_t` from representation model is not actually ground truth, it's best inferred latent state given the real observation

microcomment:
- dataset `D` contains past episodes
- state `s_t` is a continuous vector


## (3) Learning behaviours by latent imagination
describes the main method
- dreamer learns by imagining latent trajectories (LT)
- what is trained:
  - action model that chooses the action
  - value model, estimates future rewards
- how is the model trained via backprop? gradients flow through:
- actions -> latent state -> rewards -> values

already mentioned problem with previous model:
- when they plan an action, they consider only a fixed number of steps
  - this can miss rewards after the horizon (!)
- dreamer solves this by learning value model that estimates **how to value what comes after the horizon**

imagination environment
- learned latent dynamics define a Markov decision process (MDP) in latent space. this means that it's partially observed
- fully observed MDP => agent can see full state needed for prediction (image)
- imagined trajectories start from latent states produced from past experience
- we already know to imagine `s_t`, `r_t`, `a_t` using above
- however, in paper, they define all imagined quantities with subindex $\tau$ so we will do the same here
- $s_\tau \sim q(s_\tau \mid s_{\tau-1}, a_{\tau-1})$, imagined latent state
- $r_\tau \sim q(r_\tau \mid s_\tau)$, imagined action
- $a_\tau \sim q(a_\tau \mid s_\tau)$, imagined rewards
- $\tau$ time index inside of an imagination
- definition of imagined object is:
  - $E_q \left[ \sum_{\tau=t}^{\infty} \gamma^{\tau-t} r_\tau \right]$
  - `E_q` is expectation for learned model and policy
  - $\gamma$ is a discount factor
  - $\gamma^{\tau-t}$, discount weight for a reward at $\tau$, future rewards have less contribution to the final expectation
  - `$r_{\tau}$ reward at imagined time $\tau$

dreamer algorithm:
- inputs
  - dataset D (past experience)
  - `S` random seed episodes 
  - $\theta$ world model params
  - $\phi$ action model params
  - $\psi$ value model params
  - `B` batch size
  - `L` sequence length
    - todo: define what is this exactly
  - `H` imagination time horizon
  - `α` LR
  - `C` collection interval
    - todo: define this as well
- outputs:
  - trained action model
- steps:
  1. init dataset `D` and `S` random epsiodes
  2. init params
  3. start loop until convergence
    1. dynamics learning (world model params, $\theta$)
      1. get `B` sequences of len `L` from dataset `D`
      2. compute model states $s_t \sim p_\theta(s_t \mid s_{t-1}, a_{t-1}, o_t)$
      3. update $\theta$ (by calculating loss from down below and using gradients to backprop and update weights)
        - $J_{\mathrm{REC}}(\theta) = \mathbb{E}_{p} \left[ \sum_{t=1}^{T} \left( \ln q_{\theta}(o_t \mid s_t) + \ln q_{\theta}(r_t \mid s_t) - \beta\, \mathrm{KL} \left( p_{\theta}(s_t \mid s_{t-1}, a_{t-1}, o_t) \;\middle\|\; q_{\theta}(s_t \mid s_{t-1}, a_{t-1}) \right) \right) \right] + \mathrm{const}$
        - $J_{\mathrm{REC}} = \mathbb{E}_{p} \left[ \sum_t \left( J_O^t + J_R^t + J_D^t \right) \right] + \mathrm{const}$
    2. behaviour learning (action and value model, $\phi$, $\psi$)
      1. start from latent state(s) `s_t`
      2. imagine trajectories for `H` steps
      3. predict reward and values
      4. compute value targets via $V_\delta$
