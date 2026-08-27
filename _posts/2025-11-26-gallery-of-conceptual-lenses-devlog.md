---
title: "Devlog: Gallery of Conceptual Lenses"
date: 2025-11-26
project: gallery-of-conceptual-lenses
---

I spent most of a day going through prompt engineering research and current work on latent space, trying to answer the plain version of the question: how do you get better output from a model?

That turned into a side rabbit hole. Not how do you ask a harder question, but how do you extend the model's horizon so it reaches material it wouldn't normally reach.

## The problem

When you send a prompt, you activate a particular set of neurons and connections in the hidden layers, and which ones light up is dictated by how your prompt relates to everything the model learned. Most of the latent space stays dark.

That's usually the correct behavior. It's efficient and it keeps the answer related to what you asked. But if what you want is creativity, the dark part is exactly where you want it going, and the question becomes how you make it search there deliberately.

## Lenses

A lens is a frame of thought: a philosophy, a discipline, a language, a subject, an objective. A handle that forces a different approach to the same prompt. There are several distinct lens types and they can be crossed, so you can combine ontological principles with philosophical frames and get an approach that wouldn't occur on its own.

The mechanic:

1. Embed the prompt to locate it in the space. To be precise about which space, this isn't the embedding space of the entire language. It's the space of the lens set you selected.
2. Pick your lenses. Say you pick four.
3. Generate the combinations, a four by four matrix of them. You end up with things like Buddhism, JavaScript, Gravel, Sky.
4. Find the combination closest to your prompt. That's your anchor.
5. Then find the combinations that are as far from your prompt and from each other as possible, so the set spreads across the space instead of clustering in one corner of it.
6. Hand the model the prompt plus those approaches and tell it to answer through each one.

Instead of one prompt producing one default trajectory, you have a set of deliberately distant entry points, each activating a different region, each with different material to pull from.

## The drawback

This makes the model less focused. I'm explicitly forcing it to wander, so drift is the cost of admission, not a bug I can tune out later.

Which means it's the wrong tool when you need one tight answer, and the right tool when you need a spread. For brainstorming and getting to genuinely novel angles it's been useful.

The one-line version: creativity through distance. Choose lenses far apart from each other and far from the prompt, widen the search, then pull the good results back toward what you originally wanted.
