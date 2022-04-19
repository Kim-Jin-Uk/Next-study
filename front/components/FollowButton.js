import React, { useCallback } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = function ({ post }) {
  const dispatch = useDispatch();
  const { user, followingLoading, unfollowingLoading } = useSelector((state) => state.user);
  const isFollowing = user?.Followings.find((v) => v.id === post.User.id);
  const onCLickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [isFollowing]);

  if (post.User.id === user.id) {
    return null;
  }

  return (
    <Button loading={followingLoading || unfollowingLoading} onClick={onCLickButton}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
