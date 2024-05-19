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
  Textarea,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import {
  useDeletePostMutation,
  useUpdatePostMutation,
  useCurrentUserQuery,
} from "../graphql/generated/graphql";

interface PostActionsProps {
  body: string;
  postId: number;
  authorId: number;
}

export const PostActions: React.FC<PostActionsProps> = ({
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

  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();
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
      />
      <MenuList>
        {validUser ? (
          <MenuItem icon={<LuPencil />} aria-label="Edit Post" onClick={onOpen}>
            Edit Post
          </MenuItem>
        ) : null}
        <MenuItem
          icon={<FaRegFlag />}
          aria-label="Report Post"
          onClick={() => {}}
        >
          Report Post
        </MenuItem>
        {validUser ? (
          <MenuItem
            icon={<LuTrash2 />}
            aria-label="Delete Post"
            onClick={onDeleteOpen}
          >
            Delete Post
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
              Edit Post
            </AlertDialogHeader>
            <AlertDialogBody>
              <Textarea
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
                  updatePost({ variables: { id: postId, body: editBody } });
                  onClose();
                }}
                ml={3}
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
              Delete Post
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
                  deletePost({
                    variables: { id: postId },
                    update: (cache) => {
                      cache.evict({ id: "Post:" + postId });
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
