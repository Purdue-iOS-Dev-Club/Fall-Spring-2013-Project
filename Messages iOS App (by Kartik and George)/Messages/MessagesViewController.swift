//
//  MessagesViewController.swift
//  Messages
//
//  Created by George Lo on 10/24/14.
//  Copyright (c) 2014 Purdue iOS Club. All rights reserved.
//

import UIKit

class MessagesViewController: JSQMessagesViewController {
    
    var messagesArray: [JSQTextMessage] = []

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // Must be implemented from JSQ Library
    override func didPressSendButton(button: UIButton!, withMessageText text: String!, senderId: String!, senderDisplayName: String!, date: NSDate!) {
        let message = JSQTextMessage(senderId: senderId, senderDisplayName: senderDisplayName, date: date, text: text)
        messagesArray.append(message)
        NSLog("Message Array: %@", messagesArray)
        self.finishSendingMessage()
    }
    
    // Must be implemented from JSQ Library
    // Bubble's Background
    override func collectionView(collectionView: JSQMessagesCollectionView!, messageBubbleImageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageBubbleImageDataSource! {
        let message = self.messagesArray[indexPath.item]
        
        let factory = JSQMessagesBubbleImageFactory()
        if (message.senderId == self.senderId) {
            return factory.outgoingMessagesBubbleImageWithColor(UIColor.jsq_messageBubbleLightGrayColor())
        }
        return factory.incomingMessagesBubbleImageWithColor(UIColor.jsq_messageBubbleGreenColor())
    }
    
    // Must be implemented from JSQ Library
    // Avatar's Image next to each message
    override func collectionView(collectionView: JSQMessagesCollectionView!, avatarImageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageAvatarImageDataSource! {
        return nil
    }
    
    // Must be implemented from JSQ Library
    // Feed Data into the view
    override func collectionView(collectionView: JSQMessagesCollectionView!, messageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageData! {
        return self.messagesArray[indexPath.item]
    }
    
    // Must be implemented from JSQ Library
    // Number of items in each section
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.messagesArray.count
    }
    
    // Must be implemented from JSQ Library
    // Configure how each cell ("Message") should look like
    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = super.collectionView(collectionView, cellForItemAtIndexPath: indexPath) as JSQMessagesCollectionViewCell
        
        let msg = self.messagesArray[indexPath.item]
        
        if (msg.isKindOfClass(JSQTextMessage.classForCoder())) {
            if (msg.senderId == self.senderId) {
                cell.textView.textColor = UIColor.blackColor()
            } else {
                cell.textView.textColor = UIColor.whiteColor()
            }
            cell.textView.linkTextAttributes = [NSForegroundColorAttributeName: cell.textView.textColor,
                NSUnderlineStyleAttributeName: NSUnderlineStyle.StyleSingle.rawValue]
        }
        
        return cell
    }
}
