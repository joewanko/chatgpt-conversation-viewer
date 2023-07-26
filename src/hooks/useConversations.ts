import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, NodeData } from '../types';
import { EXCERPT_LENGTH } from '../constants';

function getDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('ChatApp', 1);
        openRequest.onupgradeneeded = function () {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('conversations')) {
                db.createObjectStore('conversations');
            }
        };
        openRequest.onsuccess = function () {
            resolve(openRequest.result);
        };
        openRequest.onerror = function () {
            reject(openRequest.error);
        };
    });
};

interface useConversationsOptions {
    searchTerm: string;
}

const useConversations = ({ searchTerm }: useConversationsOptions) => {
    const [formattedConversations, setFormattedConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const processConversations = useCallback((data: any[]) => {
        try {
            const formattedData = data.map((conversation: any) => {
                let allMessages: string[] = [];
                Object.values(conversation.mapping as NodeData[]).filter((nodeData: NodeData) => {
                    return nodeData?.message?.content?.parts && nodeData?.message?.content?.parts?.length > 0 && !!nodeData.message.content.parts.join();
                }).forEach((nodeData: NodeData) => {
                    nodeData?.message?.content?.parts?.length && allMessages.push(nodeData?.message?.content?.parts?.join());
                });

                const date = new Date(conversation.create_time * 1000);
                return {
                    id: "https://chat.openai.com/c/" + conversation.id,
                    title: conversation.title,
                    date: date.toLocaleDateString(),
                    excerpt: allMessages[0]?.slice(0, EXCERPT_LENGTH),
                    prompt: allMessages[0],
                    allMessages: allMessages.join(" "),
                };
            });

            setFormattedConversations(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error processing conversations:", error);
            setFormattedConversations([]);
            // Clear the data in IndexedDB
            const openRequest = indexedDB.open('ChatApp', 1);
            openRequest.onsuccess = function () {
                const db = openRequest.result;
                const transaction = db.transaction('conversations', 'readwrite');
                const store = transaction.objectStore('conversations');
                store.delete('data');
            };
        }
    }, []);

    const filteredConversations = useMemo(() => {
        return formattedConversations.filter((conversation: Conversation) =>
            conversation.allMessages?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            conversation.title?.toLowerCase().includes(searchTerm?.toLowerCase())
        );
    }, [formattedConversations, searchTerm]);

    const clearConversations = useCallback(async () => {
        setFormattedConversations([]);
        const db: IDBDatabase = await getDb();
        const transaction = db.transaction('conversations', 'readwrite');
        const store = transaction.objectStore('conversations');
        store.delete('data');
    }, []);

    const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = async function (event) {
                const data = JSON.parse(String(event?.target?.result));
                processConversations(data);

                const db: IDBDatabase = await getDb();
                const transaction = db.transaction('conversations', 'readwrite');
                const store = transaction.objectStore('conversations');
                store.put(data, 'data');
            };

            reader.readAsText(file);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const db = await getDb();
            const transaction = db.transaction('conversations', 'readonly');
            const store = transaction.objectStore('conversations');
            const getRequest = store.get('data');

            getRequest.onsuccess = function () {
                if (getRequest.result) {
                    processConversations(getRequest.result);
                }

                setIsLoading(false);
            };
        })();
    }, []);

    return {
        conversations: filteredConversations,
        isLoading,
        clearConversations,
        handleFileSelect,
    };
};

export default useConversations;
