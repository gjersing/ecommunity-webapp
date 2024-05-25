import React, { useRef, useState } from "react";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import {
  useCurrentUserQuery,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "../graphql/generated/graphql";
import { ActionsProps } from "../types";

export const CommentActions: React.FC<ActionsProps> = ({
  body,
  authorId,
  postId,
}) => {
  const [editBody, setEditBody] = useState(body);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { data: userData } = useCurrentUserQuery();

  const userId = userData?.current_user?.id;
  const validUser = authorId === userId || userId === 1;

  const handleEditChange = (e: any) => {
    setEditBody(e.target.value);
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<BsThreeDotsVertical />}
        variant="ghost"
        colorScheme="gray"
        aria-label="See menu"
        ml="auto"
      />
      <MenuList>
        {validUser ? (
          <MenuItem
            icon={<LuPencil />}
            aria-label="Edit Comment"
            onClick={onOpen}
          >
            Edit Comment
          </MenuItem>
        ) : null}
        <MenuItem
          icon={<FaRegFlag />}
          aria-label="Report Comment"
          onClick={() => {}}
        >
          Report Comment
        </MenuItem>
        {validUser ? (
          <MenuItem
            icon={<LuTrash2 />}
            aria-label="Delete Comment"
            onClick={onDeleteOpen}
          >
            Delete Comment
          </MenuItem>
        ) : null}
      </MenuList>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit Comment
            </AlertDialogHeader>
            <AlertDialogBody>
              <Input
                value={editBody}
                onChange={handleEditChange}
                placeholder={body}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  updateComment({ variables: { id: postId, body: editBody } });
                  onClose();
                }}
                ml={3}
                type="submit"
              >
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Comment
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteComment({
                    variables: { id: postId },
                    update: (cache) => {
                      cache.evict({ id: "Comment:" + postId });
                    },
                  });
                  onDeleteClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Menu>
  );
};
