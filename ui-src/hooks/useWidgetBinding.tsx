import * as React  from 'react'
import { useEffect, useState } from 'react';
import { WidgetMessageEvent } from '../types';



export const useWidgetBinding = (): (WidgetMessageEvent | undefined)[] => {
    const [message, setMessage] = useState<WidgetMessageEvent | undefined>();
    
    useEffect(() => {
        //listen for messages from figma widget
        const listener = (event: any) => {
            const widgetEvent: WidgetMessageEvent = event;
            setMessage(widgetEvent);
        };
        window.addEventListener('message', listener);
        return () => {
            window.removeEventListener('message', listener);
        };
    }, []);
    return [message];
}