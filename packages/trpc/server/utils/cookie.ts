import { CookieOptions,Request,Response } from 'express';
import { TRPCContext } from '../context';
import { acceptsRequestBody } from 'trpc-to-openapi';

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const defaultCookieOptions : CookieOptions = {
    httpOnly : true,
    secure : false, // set to true in production
    sameSite : 'strict',
    path : '/',
    maxAge : ONE_YEAR
}

export function createCookieFactory(res : Response){
    return function createCookie(
        name: string,
        value: string,
        opts : CookieOptions = defaultCookieOptions
    ){
        res.cookie(name,value,opts)
    }
}

export function getCookieFactory(req : Request){
    return function getCookie(name: string){
        return req.cookies[name]
    } 
}

export function clearCookieFactory(res : Response){
    return function clearCookie(name: string){
        res.clearCookie(name)
    }
}


// authentication cookie utils

export function setAuthenticationCookie(ctx : TRPCContext, accessToken : string){
    ctx.createCookie('Authentication-Token',accessToken)
}

export function getAuthenticationCookie(ctx : TRPCContext){
    return ctx.getCookie('Authentication-Token')
}

export function clearAuthenticationCookie(ctx : TRPCContext){
    ctx.clearCookie('Authentication-Token')
}