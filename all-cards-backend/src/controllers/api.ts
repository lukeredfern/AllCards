"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};


export const getState = (req: Request, res: Response) => {
    const gameId = req.params.gameId;
    res.setHeader("Content-Type", "application/json");
    const data = {
        id: gameId,
        stacks: [
            {
                id: new Date().getSeconds(),
                cards: [
                    {id: "1"},
                    {id: "2"},
                ]
            },
            {
                id: "two",
                cards: [
                    {id: "3"},
                    {id: "4"},
                ]
            }
        ]
    };
    res.end(JSON.stringify(data, null, 3));
};

export const move = (req: Request, res: Response) => {
    const gameId = req.params.gameId;
    const cardId = req.body.cardId;
    const destinationStackId = req.body.stackId;
    const sourceStackId = '12345';
    res.setHeader("Content-Type", "application/json");
    const data = {cardId, sourceStackId, destinationStackId,};
    res.end(JSON.stringify(data, null, 3));
};

export const game = (req: Request, res: Response) => {
    res.render("game", {
        title: "Game",
        gameId: req.params.gameId
    });
};
